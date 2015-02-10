// database.js

// models
var StudentModule     = require('./models/student');
var FacultyModule     = require('./models/faculty');
var CourseModule      = require('./models/course');
var ClassModule       = require('./models/class');
var EnrollmentModule  = require('./models/enrollment');

// utils
var fs     = require('fs');
var parse  = require('csv-parse');

module.exports = function(mongoose) {
    'use strict';

    mongoose.connect('mongodb://localhost/students');

    var Student     = new StudentModule(mongoose);
    var Faculty     = new FacultyModule(mongoose);
    var Course      = new CourseModule(mongoose);
    var Class       = new ClassModule(mongoose);
    var Enrollment  = new EnrollmentModule(mongoose);
    var exports = {};

    var processCSV = function (data, callback) {
        callback = (typeof callback === 'function') ? callback : function() {};

        // Data is good
        callback(null);
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
                        // Data is good
                        processCSV(data, callback);
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
