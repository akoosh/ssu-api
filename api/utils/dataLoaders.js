// dataLoaders.js
'use strict';

var Async = require('async');
var _     = require('lodash');

var exports = {};

exports.loadCourses = function(courses, models, callback) {

    var bulk = models.Course.collection.initializeOrderedBulkOp();
    var docs = courses.forEach(function(course) {
        // all required keys in Course should also be in data
        var doc = new models.Course();
        for (var key in models.Course.schema.paths) {
            if (key in course) {
                doc[key] = course[key];
            }
        }
        doc.key = doc.subject + doc.catalog;
        bulk.find({subject: doc.subject, catalog: doc.catalog}).upsert().updateOne(_.omit(doc.toObject(), '_id'));
    });

    bulk.execute(callback);
};

exports.loadRequisites = function(rows, models,callback) {
    var courseKeys = {};
    rows.forEach(function(row) {
        courseKeys[row.subject + row.catalog] = true;
        courseKeys[row.requisite_subject + row.requisite_catalog] = true;
    });
    var keys = Object.keys(courseKeys);

    models.Course.find({key: {$in: keys}}, function(err, courses) {
        if (err) {
            callback(err);
        } else if (courses.length < keys.length) {
            callback('At least one of the courses is not in the database.');
        } else {
            var bulk = models.Requisite.collection.initializeUnorderedBulkOp();
            var coursesByKey = {};
            courses.forEach(function(course) {
                coursesByKey[course.key] = course;
            });

            rows.forEach(function(row) {
                var course = coursesByKey[row.subject + row.catalog];
                var requisite = coursesByKey[row.requisite_subject + row.requisite_catalog];
                var doc = new models.Requisite({
                    course:     course._id,
                    requisite:  requisite._id,
                    type:       row.type,
                    grade:      row.grade
                });

                bulk.find({course: doc.course, requisite: doc.requisite}).upsert().updateOne(_.omit(doc.toObject(), '_id'));
            });

            bulk.execute(callback);
        }
    });
};

exports.loadEnrollments = function(rows, models, callback) {
    // This could get complicated. Right now, we can assume that all courses
    // are in the database, but not all sections in a given semester. It is
    // likely that this data will contian Students, Sections, and Faculty that
    // have previously not been encountered.

    var allStudents = studentDictFromData(rows, models);
    var allFaculty = facultyDictFromData(rows, models);
    var allCourses = courseDictFromData(rows, models);

    Async.parallel({
        studentObjectIds: function(callback) {
            loadStudentsIfNeeded(allStudents, models, callback);
        },

        facultyObjectIds: function(callback) {
            loadFacultyIfNeeded(allFaculty, models, callback);
        },

        courseObjectIds: function(callback) {
            loadCoursesIfNeeded(allCourses, models, callback);
        }
    }, function(err, results) {
        if (err) {
            callback(err);
        } else {
            // At this point we should have all ObjectIds for students, courses and
            // faculty members in the data file.

            var allSections = sectionDictFromData(rows, models, results.courseObjectIds, results.facultyObjectIds);

            loadSectionsIfNeeded(allSections, models, function(err, sectionObjectIds) {
                if (err) {
                    callback(err);
                } else {
                    // At this point we should also have all of the ObjectIds of the sections

                    var allAdvisements = advisementDictFromData(rows, models, results.studentObjectIds, results.facultyObjectIds);
                    var allEnrollments = enrollmentDictFromData(rows, models, results.studentObjectIds, sectionObjectIds);

                    Async.parallel([
                        function(callback) {
                            saveAdvisements(_.values(allAdvisements), models, callback);
                        },

                        function(callback) {
                            saveEnrollments(_.values(allEnrollments), models, callback);
                        }
                    ], callback);
                }
            });
        }
    });
};

function studentDictFromData(rows, models) {
    var allStudents = {};
    rows.forEach(function(row) {
        // Create student entity
        if (!allStudents[row.student_id]) {
            var student = studentFromData(row, models);
            allStudents[student.student_id] = student;
        }
    });

    return allStudents;
}

function facultyDictFromData(rows, models) {
    var allFaculty = {};
    rows.forEach(function(row) {
        // Create faculty entities for instructor and advisor
        if (!allFaculty[row.instructor_id]) {
            var instructor = instructorFromData(row, models);
            allFaculty[instructor.faculty_id] = instructor;
        }

        if (!allFaculty[row.advisor_id]) {
            var advisor = advisorFromData(row, models);
            allFaculty[advisor.faculty_id] = advisor;
        }
    });

    return allFaculty;
}

function courseDictFromData(rows, models) {
    var allCourses = {};
    rows.forEach(function(row) {
        // Create course entity
        if (!allCourses[row.subject + row.catalog]) {
            var course = courseFromData(row, models);
            allCourses[course.key] = course;
        }
    });

    return allCourses;
}

function sectionDictFromData(rows, models, courseObjectIds, facultyObjectIds) {
    var allSections = {};
    var sectionMeetings = {};

    rows.forEach(function(row) {
        // Create section
        var sectionKey = row.term + row.class_nbr;
        if (!allSections[sectionKey]) {
            var courseId = courseObjectIds[row.subject + row.catalog];
            var instructorId = facultyObjectIds[row.instructor_id];
            var section = sectionFromData(row, models, courseId, instructorId);
            allSections[section.key] = section;
            sectionMeetings[sectionKey] = {};
        }

        var meeting = meetingFromData(row);
        var meetingKey = keyFromMeeting(meeting);
        sectionMeetings[sectionKey][meetingKey] = meeting;
    });

    // For every section, add its unique list of meetings
    Object.keys(allSections).forEach(function(sectionKey) {
        var meetings = Object.keys(sectionMeetings[sectionKey]).map(function(meetingKey) {
            return sectionMeetings[sectionKey][meetingKey];
        });

        allSections[sectionKey].meetings = meetings;
    });

    return allSections;
}

function advisementDictFromData(rows, models, studentObjectIds, facultyObjectIds) {
    var allAdvisements = {};
    rows.forEach(function(row) {
        // Create advisement
        var advisementKey = row.student_id + row.advisor_id + row.term;
        if (!allAdvisements[advisementKey]) {
            var studentId = studentObjectIds[row.student_id];
            var advisorId = facultyObjectIds[row.advisor_id];
            var advisement = advisementFromData(row, models, studentId, advisorId);
            allAdvisements[advisementKey] = advisement;
        }
    });

    return allAdvisements;
}

function enrollmentDictFromData(rows, models, studentObjectIds, sectionObjectIds) {
    var allEnrollments = {};
    rows.forEach(function(row) {
        // Create enrollment
        var enrollmentKey = row.student_id + row.term + row.class_nbr;
        if (!allEnrollments[enrollmentKey]) {
            var studentId = studentObjectIds[row.student_id];
            var sectionId = sectionObjectIds[row.term + row.class_nbr];
            var enrollment = enrollmentFromData(row, models, studentId, sectionId);
            allEnrollments[enrollmentKey] = enrollment;
        }
    });

    return allEnrollments;
}



function studentFromData(data, models) {
    var student = new models.Student();
    for (var key in models.Student.schema.paths) {
        if (key in data) {
            student[key] = data[key];
        }
    }

    return student;
}

function instructorFromData(data, models) {
    var instructorName = data.instructor_name.split(/,/);
    var instructor = new models.Faculty({
        faculty_id: data.instructor_id,
        last_name: instructorName[0],
        first_name: instructorName.length > 1 ? instructorName[1] : null
    });

    return instructor;
}

function advisorFromData(data, models) {
    var advisorName = data.advisor_name.split(/,/);
    var advisor = new models.Faculty({
        faculty_id: data.advisor_id,
        last_name: advisorName[0],
        first_name: advisorName.length > 1 ? advisorName[1] : null
    });

    return advisor;
}

function courseFromData(data, models) {
    var course = new models.Course();
    for (var key in models.Course.schema.paths) {
        if (key in data) {
            course[key] = data[key];
        }
    }

    course.key = course.subject + course.catalog;
    course.min_units = data.section_units;
    course.max_units = data.section_units;

    return course;
}

function sectionFromData(data, models, courseId, instructorId) {
    // all required keys in Section should also be in data
    // except for course, instructor, and meetings
    var section = new models.Section();
    for (var key in models.Section.schema.paths) {
        if (key in data) {
            section[key] = data[key];
        }
    }

    section.key = section.term + section.class_nbr;
    section.course = courseId;
    section.instructor = instructorId;

    return section;
}

function meetingFromData(data) {
    return {
        facil_id: data.facil_id,
        mtg_start: data.mtg_start,
        mtg_end: data.mtg_end,
        pat: data.pat
    };
}

function keyFromMeeting(meeting) {
    return meeting.facil_id + meeting.mtg_start + meeting.mtg_end + meeting.pat;
}

function advisementFromData(data, models, studentId, advisorId) {
    // all required keys in Advisement should also be in data
    // except for student and section
    var advisement = new models.Advisement();
    for (var key in models.Advisement.schema.paths) {
        if (key in data) {
            advisement[key] = data[key];
        }
    }

    advisement.student = studentId;
    advisement.advisor = advisorId;

    return advisement;
}

function enrollmentFromData(data, models, studentId, sectionId) {
    // all required keys in Enrollment should also be in data
    // except for student and section
    var enrollment = new models.Enrollment();
    for (var key in models.Enrollment.schema.paths) {
        if (key in data) {
            enrollment[key] = data[key];
        }
    }

    enrollment.student = studentId;
    enrollment.section = sectionId;

    return enrollment;
}

function loadStudentsIfNeeded(allStudents, models, callback) {

    // This function takes an array of Student entities, saves them to the database
    // if they are not already there, and returns an object whose keys are student
    // id numbers and whose values are the ObjectId for that entity in the database.

    var studentIds = Object.keys(allStudents);
    var studentObjectIds = {};

    models.Student.find({student_id: {$in: studentIds}}, function(err, students) {
        if (err) {
            callback(err);
        } else {
            students.forEach(function(student) {
                studentObjectIds[student.student_id] = student._id;
            });

            // we now have object ids for students in the database, but not for the rest.
            // This filter gets the student ids who we do not yet have ObjectIds for.
            var newIds = studentIds.filter(function(id) {
                return !studentObjectIds[id];
            });

            if (newIds.length === 0) {
                callback(null, studentObjectIds);
            } else {
                var bulk = models.Student.collection.initializeUnorderedBulkOp();

                newIds.forEach(function(id) {
                    var student = allStudents[id];
                    studentObjectIds[student.student_id] = student._id;
                    bulk.insert(student.toObject());
                });

                bulk.execute(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, studentObjectIds);
                    }
                });
            }
        }
    });
}

function loadFacultyIfNeeded(allFaculty, models, callback) {

    // This function takes an array of Faculty entities, saves them to the database
    // if they are not already there, and returns an object whose keys are faculty
    // id numbers and whose values are the ObjectId for that entity in the database.

    var facultyIds = Object.keys(allFaculty);
    var facultyObjectIds = {};

    models.Faculty.find({faculty_id: {$in: facultyIds}}, function(err, docs) {
        if (err) {
            callback(err);
        } else {
            docs.forEach(function(faculty) {
                facultyObjectIds[faculty.faculty_id] = faculty._id;
            });

            // we now have object ids for faculty in the database, but not for the rest.
            // This filter gets the faculty ids who we do not yet have ObjectIds for.
            var newIds = facultyIds.filter(function(id) {
                return !facultyObjectIds[id];
            });

            if (newIds.length === 0) {
                callback(null, facultyObjectIds);
            } else {
                var bulk = models.Faculty.collection.initializeUnorderedBulkOp();

                newIds.forEach(function(id) {
                    var faculty = allFaculty[id];
                    facultyObjectIds[faculty.faculty_id] = faculty._id;
                    bulk.insert(faculty.toObject());
                });

                bulk.execute(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, facultyObjectIds);
                    }
                });
            }
        }
    });
}

function loadCoursesIfNeeded(allCourses, models, callback) {

    var courseKeys = Object.keys(allCourses);
    var courseObjectIds = {};

    models.Course.find({key: {$in: courseKeys}}, function(err, docs) {
        if (err) {
            callback(err);
        } else {
            docs.forEach(function(course) {
                courseObjectIds[course.key] = course._id;
            });

            // we now have object ids for courses in the database, but not for the rest.
            // This filter gets the course keys who we do not yet have ObjectIds for.
            var newKeys = courseKeys.filter(function(key) {
                return !courseObjectIds[key];
            });

            if (newKeys.length === 0) {
                callback(null, courseObjectIds);
            } else {
                var bulk = models.Course.collection.initializeUnorderedBulkOp();

                newKeys.forEach(function(key) {
                    var course = allCourses[key];
                    courseObjectIds[course.key] = course._id;
                    bulk.insert(course.toObject());
                });
                bulk.execute(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, courseObjectIds);
                    }
                });
            }
        }
    });
}

function loadSectionsIfNeeded(allSections, models, callback) {

    var sectionKeys = Object.keys(allSections);
    var sectionObjectIds = {};

    models.Section.find({key: {$in: sectionKeys}}, function(err, docs) {
        if (err) {
            callback(err);
        } else {
            docs.forEach(function(doc) {
                sectionObjectIds[doc.key] = doc._id;
            });

            // we now have object ids for sections in the database, but not for the rest.
            // This filter gets the keys who we do not yet have ObjectIds for.
            var newKeys = sectionKeys.filter(function(sectionKey) {
                return !sectionObjectIds[sectionKey];
            });

            if (newKeys.length === 0) {
                callback(null, sectionObjectIds);
            } else {
                var bulk = models.Section.collection.initializeUnorderedBulkOp();

                newKeys.forEach(function(key) {
                    var section = allSections[key];
                    sectionObjectIds[section.key] = section._id;
                    bulk.insert(section.toObject());
                });

                bulk.execute(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, sectionObjectIds);
                    }
                });
            }
        }
    });
}

function saveAdvisements(advisements, models, callback) {
    var bulk = models.Advisement.collection.initializeUnorderedBulkOp();

    advisements.forEach(function(advisement) {
        var params = {
            student: advisement.student,
            advisor: advisement.advisor,
            term: advisement.term
        };

        bulk.find(params).upsert().updateOne(_.omit(advisement.toObject(), '_id'));
    });

    bulk.execute(callback);
}

function saveEnrollments(enrollments, models, callback) {
    var bulk = models.Enrollment.collection.initializeUnorderedBulkOp();

    enrollments.forEach(function(enrollment) {
        var params = {
            student: enrollment.student,
            section: enrollment.section
        };

        bulk.find(params).upsert().updateOne(_.omit(enrollment.toObject(), '_id'));
    });

    bulk.execute(callback);
}

exports.loaderForSchema = {
    courses     : exports.loadCourses,
    requisites  : exports.loadRequisites,
    enrollments : exports.loadEnrollments
};

module.exports = exports;
