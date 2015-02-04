// database.js

var StudentModule     = require('./models/student');
var FacultyModule     = require('./models/faculty')(mongoose);
var CourseModule      = require('./models/course')(mongoose);
var ClassModule       = require('./models/class')(mongoose);
var EnrollmentModule  = require('./models/enrollment')(mongoose);

module.exports = function(mongoose) {
    'use strict';

    mongoose.connect('mongodb://localhost/students');

    var Student     = new StudentModule(mongoose);
    var Faculty     = new FacultyModule(mongoose);
    var Course      = new CourseModule(mongoose);
    var Class       = new ClassModule(mongoose);
    var Enrollment  = new EnrollmentModule(mongoose);
    var exports = {};

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
}();
