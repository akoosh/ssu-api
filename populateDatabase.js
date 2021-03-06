// populateDatabase.js
'use strict';

var COURSES_PATH     = './data/all-courses.csv';
var REQUISITES_PATH  = './data/cs-course-requisites.csv';
var CS_ENROLLMENTS_PATH = './data/enrollments-2093-2153-shuffled.csv';

var mongoose = require('mongoose');
var Async    = require('async');
var db       = require('./api/database.js');

mongoose.connect('mongodb://localhost/students', function(err) {
    if (err) {
        console.log('Connection error:', err);
    } else {
        console.time('Time Elapsed');
        Async.series([
            function(callback) {
                console.log('Processing courses...');
                db.processFileWithSchema('courses', COURSES_PATH, callback);
            },

            function(callback) {
                console.log('Processing requisites...');
                db.processFileWithSchema('requisites', REQUISITES_PATH, callback);
            },

            function(callback) {
                console.log('Processing CS enrollments...');
                db.processFileWithSchema('enrollments', CS_ENROLLMENTS_PATH, callback);
            }
        ], function(err) {
            if (err) {
                console.log('Error:', err);
            } else {
                console.log('Success!');
            }

            console.timeEnd('Time Elapsed');
            mongoose.disconnect();
        });
    }
});
