// database.js
'use strict';

// mongoose plugins
var deepPopulate    = require('mongoose-deep-populate');
var mongooseHidden  = require('mongoose-hidden')({autoHideObject: false});

// models
var StudentModule     = require('./models/student');
var FacultyModule     = require('./models/faculty');
var CourseModule      = require('./models/course');
var ClassModule       = require('./models/class');
var EnrollmentModule  = require('./models/enrollment');
var AdvisementModule  = require('./models/advisement');
var RequisiteModule   = require('./models/requisite');

// utils
var _           = require('lodash');
var fs          = require('fs');
var Async       = require('async');
var parse       = require('csv-parse');
var Schemas     = require('./utils/dataFileSchemas');
var Loaders     = require('./utils/dataLoaders');

module.exports = function(mongoose) {

    mongoose.connect('mongodb://localhost/students');

    // Enable this to see mongoose activity
    // mongoose.set('debug', true);

    var exports = {};

    var plugins = [
        deepPopulate,
        mongooseHidden
    ];

    var models = {
        Student     : new StudentModule(mongoose, plugins),
        Faculty     : new FacultyModule(mongoose, plugins),
        Course      : new CourseModule(mongoose, plugins),
        Class       : new ClassModule(mongoose, plugins),
        Enrollment  : new EnrollmentModule(mongoose, plugins),
        Advisement  : new AdvisementModule(mongoose, plugins),
        Requisite   : new RequisiteModule(mongoose, plugins)
    };

    // Student functions

    exports.getAllStudents = function(callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Student.find(function(err, students) {
            if (err) {
                callback(err);
            } else {
                callback(null, students);
            }
        });
    };

    exports.getStudentById = function(student_id, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Student.findOne({student_id: student_id}, function(err, student) {
            if (err) {
                callback(err);
            } else {
                callback(null, student);
            }
        });
    };

    exports.getAdvisorsByStudentId = function(student_id, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Student.findOne({student_id: student_id}, function(err, student) {
            if (err) {
                callback(err);
            } else {
                models.Advisement.find({student: student._id}).populate('advisor').exec(function(err, advisements) {
                    if (err) {
                        callback(err);
                    } else {
                        advisements.forEach(function(advisement) { advisement.student = undefined; });
                        callback(null, advisements);
                    }
                });
            }
        });
    };

    exports.getClassesByStudentId = function(student_id, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Student.findOne({student_id: student_id}, function(err, student) {
            if (err) {
                callback(err);
            } else {
                models.Enrollment.find({student: student._id}).deepPopulate('class class.instructor class.course').exec(function(err, enrollments) {
                    if (err) {
                        callback(err);
                    } else {
                        enrollments.forEach(function(enrollment) { enrollment.student = undefined; });
                        callback(null, enrollments);
                    }
                });
            }
        });
    };


    // Instructor functions

    exports.getAllInstructors = function(callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Faculty.find(function(err, instructors) {
            if (err) {
                callback(err);
            } else {
                callback(null, instructors);
            }
        });
    };

    exports.getInstructorById = function(instructor_id, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Faculty.findOne({faculty_id: instructor_id}, function(err, instructor) {
            if (err) {
                callback(err);
            } else {
                callback(null, instructor);
            }
        });
    };

    exports.getClassesByInstructorId = function(instructor_id, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Faculty.findOne({faculty_id: instructor_id}, function(err, instructor) {
            if (err) {
                callback(err);
            } else {
                models.Class.find({instructor: instructor._id}).populate('course').exec(function(err, classes) {
                    if (err) {
                        callback(err);
                    } else {
                        classes.forEach(function(c) { c.instructor = undefined; });
                        callback(null, classes);
                    }
                });
            }
        });
    };


    // Advisor functions

    exports.getAllAdvisors = function(callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Advisement.distinct('advisor', function(err, advisor_ids) {
            if (err) {
                callback(err);
            } else {
                models.Faculty.find({_id: {$in: advisor_ids}}, function(err, advisors) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, advisors);
                    }
                });
            }
        });
    };

    exports.getAdvisorById = function(advisor_id, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Advisement.distinct('advisor', function(err, advisor_ids) {
            if (err) {
                callback(err);
            } else {
                models.Faculty.findOne({_id: {$in: advisor_ids}, faculty_id: advisor_id}, function(err, advisor) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, advisor);
                    }
                });
            }
        });
    };

    exports.getStudentsByAdvisorId = function(advisor_id, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Faculty.findOne({faculty_id: advisor_id}, function(err, advisor) {
            if (err) {
                callback(err);
            } else {
                models.Advisement.find({advisor: advisor._id}).populate('student').exec(function(err, advisements) {
                    if (err) {
                        callback(err);
                    } else {
                        advisements.forEach(function(advisement) { advisement.advisor = undefined; });
                        callback(null, advisements);
                    }
                });
            }
        });
    };


    // Course routes

    exports.getAllCourses = function(callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Course.find(function(err, courses) {
            if (err) {
                callback(err);
            } else {
                callback(null, courses);
            }
        });
    };

    exports.getAllSubjects = function(callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Course.distinct('subject', function(err, subjects) {
            if (err) {
                callback(err);
            } else {
                callback(null, subjects);
            }
        });
    };

    exports.getCoursesBySubject = function(subject, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Course.find({subject: subject.toUpperCase()}, function(err, courses) {
            if (err) {
                callback(err);
            } else {
                callback(null, courses);
            }
        });
    };

    exports.getCourseBySubjectAndCatalogNumber = function(subject, catalog_number, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Course.findOne({subject: subject.toUpperCase(), catalog: catalog_number}, function(err, course) {
            if (err) {
                callback(err);
            } else {
                callback(null, course);
            }
        });
    };

    exports.getClassesBySubjectAndCatalogNumber = function(subject, catalog_number, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Course.findOne({subject: subject.toUpperCase(), catalog: catalog_number}, function(err, course) {
            if (err) {
                callback(err);
            } else {
                models.Class.find({course: course._id}).populate('course instructor').exec(function(err, classes) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, classes);
                    }
                });
            }
        });
    };

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

    exports.getEligibleStudentsBySubjectAndCatalogNumber = function(subject, catalog_number, callback) {
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
    };


    // Class functions

    exports.getAllClasses = function(callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Class.find(function(err, classes) {
            if (err) {
                callback(err);
            } else {
                callback(null, classes);
            }
        });
    };

    exports.getAllTerms = function(callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Class.distinct('term', function(err, terms) {
            if (err) {
                callback(err);
            } else {
                callback(null, terms);
            }
        });
    };

    exports.getAllClassesByTerm = function(term, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Class.find({term: term}).populate('course instructor').exec(function(err, classes) {
            if (err) {
                callback(err);
            } else {
                callback(null, classes);
            }
        });
    };

    exports.getClassByTermAndClassNumber = function(term, class_number, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Class.findOne({term: term, class_nbr: class_number}).populate('course instructor').exec(function(err, classDoc) {
            if (err) {
                callback(err);
            } else {
                callback(null, classDoc);
            }
        });
    };

    exports.getAllStudentsInClassByTermAndClassNumber = function(term, class_number, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Class.findOne({term: term, class_nbr: class_number}).populate('course instructor').exec(function(err, classDoc) {
            if (err) {
                callback(err);
            } else {
                models.Enrollment.find({class: classDoc._id}).populate('student').exec(function(err, enrollments) {
                    if (err) {
                        callback(err);
                    } else {
                        enrollments.forEach(function(enrollment) { enrollment.class = undefined; });
                        callback(null, enrollments);
                    }
                });
            }
        });
    };


    // Requisite functions

    exports.getAllRequisites = function(callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        models.Requisite.find().populate('course requisite').exec(function(err, requisites) {
            if (err) {
                callback(err);
            } else {
                callback(null, requisites);
            }
        });
    };


    // Data loading functions

    exports.processFileWithSchema = function(schemaName, filepath, callback) {
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
    };

    return exports;
};
