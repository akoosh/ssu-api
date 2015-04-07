var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var AppApi        = require('../utils/AppApi');
var Async         = require('async');
var _             = require('lodash');

var AppActions = {};

AppActions.fetchStudents = function() {
    AppApi.getStudents(function(err, students) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_STUDENTS,
                students: students
            });
        }
    });
};

AppActions.fetchDataForStudent = function(student_id) {
    Async.parallel({
        student: function(callback) {
            AppApi.getStudentById(student_id, callback);
        },

        advisors: function(callback) {
            AppApi.getAdvisorsByStudentId(student_id, callback);
        },

        sections: function(callback) {
            AppApi.getSectionsByStudentId(student_id, callback);
        }
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction(_.assign(results, {
                actionType: AppConstants.RECEIVE_STUDENT_DATA
            }));
        }
    });
};

AppActions.fetchInstructors = function() {
    AppApi.getInstructors(function(err, instructors) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_INSTRUCTORS,
                instructors: instructors
            });
        }
    });
};

AppActions.fetchAdvisors = function() {
    AppApi.getAdvisors(function(err, advisors) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_ADVISORS,
                advisors: advisors
            });
        }
    });
};

AppActions.fetchCourses = function() {
    AppApi.getCourses(function(err, courses) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_COURSES,
                courses: courses
            });
        }
    });
};

module.exports = AppActions;
