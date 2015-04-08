// database.js
'use strict';

var mongoose    = require('mongoose');
var _           = require('lodash');
var fs          = require('fs');
var Async       = require('async');
var parse       = require('csv-parse');
var Schemas     = require('./utils/dataFileSchemas');
var Loaders     = require('./utils/dataLoaders');
var models      = require('./models');

// Enable this to see mongoose activity
// mongoose.set('debug', true);

// This is a callback factory for callbacks that expect an array of results.
// The success function is only called if the data is good.
function arrayHandler(failure, success) {
    return function(err, array) {
        if (err) {
            failure(err);
        } else if (!array.length) {
            failure(204);
        } else {
            success(array);
        }
    };
}

// This is a callback factory for callbacks that expect a single result object.
// The success function is only called if the data is good.
function objectHandler(failure, success) {
    return function(err, object) {
        if (err) {
            failure(err);
        } else if (!object) {
            failure(404);
        } else {
            success(object);
        }
    };
}

// Student functions

function getAllStudents(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Student.find(arrayHandler(callback, function(students) {
        callback(null, students);
    }));
}

function getStudentById(student_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Student.findOne({student_id: student_id}, objectHandler(callback, function(student) {
        callback(null, student);
    }));
}

function getAdvisorsByStudentId(student_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getStudentById(student_id, objectHandler(callback, function(student) {
        models.Advisement.find({student: student._id}).populate('advisor').exec(arrayHandler(callback, function(advisements) {
            advisements.forEach(function(advisement) { advisement.student = undefined; });
            callback(null, advisements);
        }));
    }));
}

function getClassesByStudentId(student_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getStudentById(student_id, objectHandler(callback, function(student) {
        models.Enrollment.find({student: student._id}).deepPopulate('class class.instructor class.course').exec(arrayHandler(callback, function(enrollments) {
            enrollments.forEach(function(enrollment) { enrollment.student = undefined; });
            callback(null, enrollments);
        }));
    }));
}


// Instructor functions

function getAllInstructors(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Faculty.find(arrayHandler(callback, function(instructors) {
        callback(null, instructors);
    }));
}

function getInstructorById(instructor_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Faculty.findOne({faculty_id: instructor_id}, objectHandler(callback, function(instructor) {
        callback(null, instructor);
    }));
}

function getClassesByInstructorId(instructor_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getInstructorById(instructor_id, objectHandler(callback, function(instructor) {
        models.Class.find({instructor: instructor._id}).populate('course').exec(arrayHandler(callback, function(classes) {
            classes.forEach(function(c) { c.instructor = undefined; });
            callback(null, classes);
        }));
    }));
}


// Advisor functions

function getAllAdvisorIds(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Advisement.distinct('advisor', arrayHandler(callback, function(advisor_ids) {
        callback(null, advisor_ids);
    }));
}

function getAllAdvisors(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getAllAdvisorIds(arrayHandler(callback, function(advisor_ids) {
        models.Faculty.find({_id: {$in: advisor_ids}}, arrayHandler(callback, function(advisors) {
            callback(null, advisors);
        }));
    }));
}

function getAdvisorById(advisor_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getAllAdvisorIds(arrayHandler(callback, function(advisor_ids) {
        models.Faculty.findOne({_id: {$in: advisor_ids}, faculty_id: advisor_id}, objectHandler(callback, function(advisor) {
            callback(null, advisor);
        }));
    }));
}

function getStudentsByAdvisorId(advisor_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getAdvisorById(advisor_id, objectHandler(callback, function(advisor) {
        models.Advisement.find({advisor: advisor._id}).populate('student').exec(arrayHandler(callback, function(advisements) {
            advisements.forEach(function(advisement) { advisement.advisor = undefined; });
            callback(null, advisements);
        }));
    }));
}


// Course routes

function getAllCourses(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Course.find(arrayHandler(callback, function(courses) {
        callback(null, courses);
    }));
}

function getAllSubjects(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Course.distinct('subject', arrayHandler(callback, function(subjects) {
        callback(null, subjects);
    }));
}

function getCoursesBySubject(subject, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Course.find({subject: subject.toUpperCase()}, arrayHandler(callback, function(courses) {
        callback(null, courses);
    }));
}

function getCourseBySubjectAndCatalogNumber(subject, catalog_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Course.findOne({subject: subject.toUpperCase(), catalog: catalog_number}, objectHandler(callback, function(course) {
        callback(null, course);
    }));
}

function getClassesBySubjectAndCatalogNumber(subject, catalog_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getCourseBySubjectAndCatalogNumber(subject, catalog_number, objectHandler(callback, function(course) {
        models.Class.find({course: course._id}).populate('course instructor').exec(arrayHandler(callback, function(classes) {
            classes.forEach(function(classDoc) { classDoc.course = undefined; });
            callback(null, classes);
        }));
    }));
}

// This is a stopgap solution. Grades should probably be stored as numbers.
var gradePoints = {
    'A+'    : 4.0,
    'A'     : 4.0,
    'A-'    : 3.7,
    'B+'    : 3.3,
    'B'     : 3.0,
    'B-'    : 2.7,
    'C+'    : 2.3,
    'C'     : 2.0,
    'C-'    : 1.7,
    'D+'    : 1.3,
    'D'     : 1.0
};

function getEligibleStudentsBySubjectAndCatalogNumber(subject, catalog_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    // Get course for subject : catalog_number
    models.Course.findOne({subject: subject.toUpperCase(), catalog: catalog_number}, function(err, course) {

        // Get the req. for the given subject : catalog_number
        models.Requisite.find( { course : course._id }, function(err, requisites) {
            var preRequisites = requisites.filter( function(requisite){ 
              return requisite.type === 'P';
            });

            var reqStudentIdGetters = preRequisites.map( function(prerequisite) {
                return function(preCallback) {
                    // Find all class sections that are instances of the prerequisite
                    models.Class.find( { course : prerequisite.requisite }, function(err, classes) {
                        var classIds = _.pluck( classes, '_id' );

                        // Find all students that have taken one of those classes
                        models.Enrollment.find( { class : { $in : classIds } }, function(err, enrollments){
                            // Filter out failing grades
                            var passing = enrollments.filter(function(enrollment) {
                                return (gradePoints[enrollment.grade] || 0) >= (gradePoints[prerequisite.grade] || 0);
                            });

                            var studentIds = _.uniq( _.pluck( passing, 'student' ).map(String) );
                            preCallback( null, studentIds );
                        });
                    });
                };
            });

            Async.parallel({
                // all students that have fullfilled prerequisites
                eligibleStudentIds: function(callback) {
                    Async.parallel( reqStudentIdGetters, function(err,results) {
                        // Produces all of the studentIds who are eligible to take the class
                        var elgStudents = _.spread( _.intersection)(results);
                        callback(null, elgStudents);
                    });
                },

                // all students that have already passed the course
                doneStudentIds: function(callback) {
                    models.Class.find( { course : course._id }, function(err, classes) {
                        var classIds = _.pluck( classes, '_id' );

                        // Find all students that have taken one of those classes
                        models.Enrollment.find( { class : { $in : classIds } }, function(err, enrollments){
                            // Filter out failing grades
                            var passing = enrollments.filter(function(enrollment) {
                                return (gradePoints[enrollment.grade] || 0) >= gradePoints['C-'];
                            });

                            var studentIds = _.uniq( _.pluck( passing, 'student' ).map(String) );
                            callback( null, studentIds );
                        });
                    });
                }

            }, function(err, results) {
                // Produces the list of students that are eligible to take the course excluding those
                // that have already taken and passed it.
                var studentIds = _.difference(results.eligibleStudentIds.map(String), results.doneStudentIds.map(String));
                models.Student.find( { _id : { $in : studentIds } }, callback );
            });

        });
    });
}


// Class functions

function getAllClasses(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Class.find(arrayHandler(callback, function(classes) {
        callback(null, classes);
    }));
}

function getAllTerms(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Class.distinct('term', arrayHandler(callback, function(terms) {
        callback(null, terms);
    }));
}

function getAllClassesByTerm(term, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Class.find({term: term}).populate('course instructor').exec(arrayHandler(callback, function(classes) {
        callback(null, classes);
    }));
}

function getClassByTermAndClassNumber(term, class_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Class.findOne({term: term, class_nbr: class_number}).populate('course instructor').exec(objectHandler(callback, function(classDoc) {
        callback(null, classDoc);
    }));
}

function getAllStudentsInClassByTermAndClassNumber(term, class_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getClassByTermAndClassNumber(term, class_number, objectHandler(callback, function(classDoc) {
        models.Enrollment.find({class: classDoc._id}).populate('student').exec(arrayHandler(callback, function(enrollments) {
            enrollments.forEach(function(enrollment) { enrollment.class = undefined; });
            callback(null, enrollments);
        }));
    }));
}


// Requisite functions

function getAllRequisites(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Requisite.find().populate('course requisite').exec(arrayHandler(callback, function(requisites) {
        callback(null, requisites);
    }));
}

function getRequisitesBySubjectAndCatalogNumber(subject, catalog_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getCourseBySubjectAndCatalogNumber(subject, catalog_number, objectHandler(callback, function(course) {
        models.Requisite.find({course: course._id}).populate('requisite').exec(arrayHandler(callback, function(requisites) {
            requisites.forEach(function(requisite) { requisite.course = undefined; });
            callback(null, requisites);
        }));
    }));
}


// Data loading functions

function processFileWithSchema(schemaName, filepath, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    fs.readFile(filepath, 'utf8', function(err, data) {
        if (err) {
            callback(err);
        } else {
            var conformsToSchema = false;
            var columnNames = function(columns) {
                var transformedColumns = columns.map(Schemas.transformField);
                conformsToSchema = Schemas.conformsToSchema(schemaName, transformedColumns);

                return transformedColumns.map(Schemas.keyForFieldName);
            };

            parse(data, {columns: columnNames, trim: true}, function(err, data) {
                if (err) {
                    callback(err);
                } else if (!conformsToSchema) {
                    callback('Invalid fields: Expected: ' + Schemas[schemaName]);
                } else {
                    Loaders.loaderForSchema[schemaName](data, models, callback);
                }
            });
        }
    });
}

module.exports = {
    getAllStudents                                  : getAllStudents,
    getStudentById                                  : getStudentById,
    getAdvisorsByStudentId                          : getAdvisorsByStudentId,
    getClassesByStudentId                           : getClassesByStudentId,

    getAllInstructors                               : getAllInstructors,
    getInstructorById                               : getInstructorById,
    getClassesByInstructorId                        : getClassesByInstructorId,

    getAllAdvisors                                  : getAllAdvisors,
    getAdvisorById                                  : getAdvisorById,
    getStudentsByAdvisorId                          : getStudentsByAdvisorId,

    getAllCourses                                   : getAllCourses,
    getAllSubjects                                  : getAllSubjects,
    getCoursesBySubject                             : getCoursesBySubject,
    getCourseBySubjectAndCatalogNumber              : getCourseBySubjectAndCatalogNumber,
    getClassesBySubjectAndCatalogNumber             : getClassesBySubjectAndCatalogNumber,
    getEligibleStudentsBySubjectAndCatalogNumber    : getEligibleStudentsBySubjectAndCatalogNumber,

    getAllClasses                                   : getAllClasses,
    getAllTerms                                     : getAllTerms,
    getAllClassesByTerm                             : getAllClassesByTerm,
    getClassByTermAndClassNumber                    : getClassByTermAndClassNumber,
    getAllStudentsInClassByTermAndClassNumber       : getAllStudentsInClassByTermAndClassNumber,

    getAllRequisites                                : getAllRequisites,
    getRequisitesBySubjectAndCatalogNumber          : getRequisitesBySubjectAndCatalogNumber,

    processFileWithSchema                           : processFileWithSchema
};
