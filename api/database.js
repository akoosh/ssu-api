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
var fs          = require('fs');
var parse       = require('csv-parse');
var Schemas     = require('./utils/dataFileSchemas');
var Loaders     = require('./utils/dataLoaders');
var loadData    = require('./utils/loadData');

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

    exports.processUploadedFile = function(filepath, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        fs.readFile(filepath, 'utf8', function(err, data) {
            if (err) {
                callback(err);
            } else {
                parse(data, function(err, data) {
                    if (err) {
                        callback(err);
                    } else {
                        // data is valid CSV
                        loadData(data, models, callback);
                    }
                });
            }
        });
    };

    // The next few functions should be abstracted out into a helper function.
    // The only differences between them at this point are the names of a few
    // function calls.

    exports.processCourses = function(filepath, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        fs.readFile(filepath, 'utf8', function(err, data) {
            if (err) {
                callback(err);
            } else {
                var conformsToSchema = false;
                var columnNames = function(columns) {
                    if (Schemas.conformsToSchema('courses', columns)) {
                        conformsToSchema = true;
                    }

                    return columns.map(function(column) {
                        return column.toLowerCase().replace(/ /g, '_');
                    });
                };

                parse(data, {columns: columnNames, trim: true}, function(err, data) {
                    if (err) {
                        callback(err);
                    } else if (!conformsToSchema) {
                        callback('Invalid fields: Expected: ' + Schemas.courses);
                    } else {
                        Loaders.loadCourses(data, models, callback);
                    }
                });
            }
        });
    };

    exports.processRequisites = function(filepath, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        fs.readFile(filepath, 'utf8', function(err, data) {
            if (err) {
                callback(err);
            } else {
                var conformsToSchema = false;
                var columnNames = function(columns) {
                    if (Schemas.conformsToSchema('requisites', columns)) {
                        conformsToSchema = true;
                    }

                    return columns.map(function(column) {
                        return column.toLowerCase().replace(/ /g, '_');
                    });
                };

                parse(data, {columns: columnNames, trim: true}, function(err, data) {
                    if (err) {
                        callback(err);
                    } else if (!conformsToSchema) {
                        callback('Invalid fields: Expected: ' + Schemas.requisites);
                    } else {
                        Loaders.loadRequisites(data, models, callback);
                    }
                });
            }
        });
    };

    exports.processEnrollments = function(filepath, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        fs.readFile(filepath, 'utf8', function(err, data) {
            if (err) {
                callback(err);
            } else {
                var conformsToSchema = false;
                var columnNames = function(columns) {
                    if (Schemas.conformsToSchema('enrollments', columns)) {
                        conformsToSchema = true;
                    }

                    return columns.map(function(column) {
                        return column.toLowerCase().replace(/ /g, '_');
                    });
                };

                parse(data, {columns: columnNames, trim: true}, function(err, data) {
                    if (err) {
                        callback(err);
                    } else if (!conformsToSchema) {
                        callback('Invalid fields: Expected: ' + Schemas.enrollments);
                    } else {
                        Loaders.loadEnrollments(data, models, callback);
                    }
                });
            }
        });
    };

    return exports;
};
