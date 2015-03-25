var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var AppApi        = require('../utils/AppApi');
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
    AppApi.getStudentById(student_id, function(err, student) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_STUDENT,
                student: student
            });
        }
    });

    AppApi.getAdvisorsByStudentId(student_id, function(err, advisors) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_STUDENT_ADVISORS,
                advisors: advisors
            });
        }
    });

    AppApi.getSectionsByStudentId(student_id, function(err, sections) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_STUDENT_SECTIONS,
                sections: sections
            });
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
