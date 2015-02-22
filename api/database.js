// database.js
'use strict';

// mongoose plugins
var deepPopulate    = require('mongoose-deep-populate');
var mongooseHidden  = require('mongoose-hidden')();

// models
var StudentModule     = require('./models/student');
var FacultyModule     = require('./models/faculty');
var CourseModule      = require('./models/course');
var ClassModule       = require('./models/class');
var EnrollmentModule  = require('./models/enrollment');
var AdvisementModule  = require('./models/advisement');

// utils
var fs          = require('fs');
var parse       = require('csv-parse');
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
        Advisement  : new AdvisementModule(mongoose, plugins)
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

    return exports;
};
