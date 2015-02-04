// database.js

var mongoose = require('mongoose');
var Student  = require('./models/student')(mongoose);
var Faculty  = require('./models/faculty')(mongoose);
var Course   = require('./models/course')(mongoose);
var Class    = require('./models/class')(mongoose);

module.exports = function() {
    'use strict';

    mongoose.connect('mongodb://localhost/students');

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
