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

exports.loadRequisites = function(rows, models, callback) {

    var numRows = rows.length;
    var error = false;
    var bulk = models.Requisite.collection.initializeUnorderedBulkOp();

    rows.forEach(function(row, index) {
        Async.parallel({
            course: function(callback) {
                models.Course.findOne({key: row.subject + row.catalog}, callback);
            },

            requisite: function(callback) {
                models.Course.findOne({key: row.requisite_subject + row.requisite_catalog}, callback);
            }

        }, function(err, results) {
            if (err) {
                error = err;
            } else if (!results.course || !results.requisite) {
                error = 'At least one of the courses is not in the database.';
            } else {
                var doc = new models.Requisite({
                    course:     results.course._id,
                    requisite:   results.requisite._id,
                    type:       row.type,
                    grade:      row.grade
                });

                bulk.find({course: doc.course, requisite: doc.requisite}).upsert().updateOne(_.omit(doc.toObject(), '_id'));
            }

            // Only execute bulk operation if there have been no errors
            if (index === numRows - 1) {
                if (error) {
                    callback(error);
                } else {
                    // bulk.execute(callback);
                    bulk.execute(function(err, result) {
                        console.log('inserted:', result.nInserted);
                        console.log('upserted:', result.nUpserted);
                        console.log('matched:', result.nMatched);
                        console.log('modified:', result.nModified);
                        console.log('upserted ids:\n', result.getUpsertedIds());
                        callback(null);
                    });
                }
            }
        });
    });
};

exports.loadEnrollments = function(rows, models, callback) {
    // This could get complicated. Right now, we can assume that all courses
    // are in the database, but not all sections in a given semester. It is
    // likely that this data will contian Students, Classes, and Faculty that
    // have previously not been encountered.

    var allStudents = {};
    var allFaculty = {};
    var allCourses = {};

    // First pass through data. Build students, instructors, advisors, and courses
    rows.forEach(function(row) {
        // Create student entity
        if (!allStudents[row.student_id]) {
            var student = studentFromData(row, models);
            allStudents[student.student_id] = student;
        }

        // Create faculty entities for instructor and advisor
        if (!allFaculty[row.instructor_id]) {
            var instructor = instructorFromData(row, models);
            allFaculty[instructor.faculty_id] = instructor;
        }

        if (!allFaculty[row.advisor_id]) {
            var advisor = advisorFromData(row, models);
            allFaculty[advisor.faculty_id] = advisor;
        }

        // Create course entity
        if (!allCourses[row.subject + row.catalog]) {
            var course = courseFromData(row, models);
            allCourses[course.key] = course;
        }
    });

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
        // At this point we should have all ObjectIds for students, courses and
        // faculty members in the data file.

        var allClasses = {};
        var classMeetings = {};
        var allAdvisements = {};

        // Second pass through data. Build classes and advisements
        rows.forEach(function(row) {
            // Create class
            var classKey = row.term + row.class_nbr;
            if (!allClasses[classKey]) {
                var courseId = results.courseObjectIds[row.subject + row.catalog];
                var instructorId = results.facultyObjectIds[row.instructor_id];
                var classDoc = classFromData(row, models, courseId, instructorId);
                allClasses[classDoc.key] = classDoc;
                classMeetings[classKey] = {};
            }

            var meeting = meetingFromData(row);
            var meetingKey = keyFromMeeting(meeting);
            classMeetings[classKey][meetingKey] = meeting;

            // Create advisement
            var advisementKey = row.student_id + row.advisor_id + row.term;
            if (!allAdvisements[advisementKey]) {
                var studentId = results.studentObjectIds[row.student_id];
                var advisorId = results.facultyObjectIds[row.advisor_id];
                var advisement = advisementFromData(row, models, studentId, advisorId);
                allAdvisements[advisementKey] = advisement;
            }
        });

        // For every class, add its unique list of meetings
        Object.keys(allClasses).forEach(function(classKey) {
            var meetings = Object.keys(classMeetings[classKey]).map(function(meetingKey) {
                return classMeetings[classKey][meetingKey];
            });

            allClasses[classKey].meetings = meetings;
        });

        callback(null);
    });
};

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
    return course;
}

function classFromData(data, models, courseId, instructorId) {
    // all required keys in Class should also be in data
    // except for course, instructor, and meetings
    var classDoc = new models.Class();
    for (var key in models.Class.schema.paths) {
        if (key in data) {
            classDoc[key] = data[key];
        }
    }

    classDoc.key = classDoc.term + classDoc.class_nbr;
    classDoc.course = courseId;
    classDoc.instructor = instructorId;

    return classDoc;
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
    // except for student and class
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

module.exports = exports;
