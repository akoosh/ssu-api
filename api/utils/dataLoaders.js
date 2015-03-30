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
                models.Course.findOne({subject: row.subject, catalog: row.catalog}, callback);
            },

            requisite: function(callback) {
                models.Course.findOne({subject: row.requisite_subject, catalog: row.requisite_catalog}, callback);
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

exports.loadEnrollments = function(rows, models, callback) {
    // This could get complicated. Right now, we can assume that all courses
    // are in the database, but not all sections in a given semester. It is
    // likely that this data will contian Students, Classes, and Faculty that
    // have previously not been encountered.

    var allStudents = {};
    var allFaculty = {};

    rows.forEach(function(row) {
        // Create student entity
        var student = studentFromData(row, models);
        allStudents[student.student_id] = student;

        // Create faculty entities for instructor and advisor
        var instructor = instructorFromData(row, models);
        allFaculty[instructor.faculty_id] = instructor;

        var advisor = advisorFromData(row, models);
        allFaculty[advisor.faculty_id] = advisor;
    });

    loadFacultyIfNeeded(allFaculty, models, function(err, facultyObjectIds) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};

module.exports = exports;
