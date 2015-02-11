// database.js

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
    'use strict';

    mongoose.connect('mongodb://localhost/students');

    var exports = {};
    var models = {
        Student     : new StudentModule(mongoose),
        Faculty     : new FacultyModule(mongoose),
        Course      : new CourseModule(mongoose),
        Class       : new ClassModule(mongoose),
        Enrollment  : new EnrollmentModule(mongoose),
        Advisement  : new AdvisementModule(mongoose)
    };

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

    exports.getAllStudents = function(callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        Student.find(function(err, students) {
            if (err) {
                callback(err);
            } else {
                callback(null, students);
            }
        });
    };

    exports.getStudentById = function(sid, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        Student.find({sid: sid}, function(err, student) {
            if (err) {
                callback(err);
            } else {
                callback(null, student);
            }
        });
    };

    return exports;
};
