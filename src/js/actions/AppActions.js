var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var AppApi        = require('../utils/AppApi');
var Async         = require('async');
var _             = require('lodash');

// List data stores
var StudentListDataStore    = require('../stores/StudentListDataStore');
var InstructorListDataStore = require('../stores/InstructorListDataStore');
var AdvisorListDataStore    = require('../stores/AdvisorListDataStore');
var CourseListDataStore     = require('../stores/CourseListDataStore');

var AppActions = {};

AppActions.fetchStudents = function() {
    AppApi.getStudents(function(err, students) {
        if (err) {
            console.log(err);
        } else {
            StudentListDataStore.updateStudents(students);
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
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_STUDENT_DATA,
                student_id: student_id,
                data: results
            });
        }
    });
};

AppActions.fetchInstructors = function() {
    AppApi.getInstructors(function(err, instructors) {
        if (err) {
            console.log(err);
        } else {
            InstructorListDataStore.updateInstructors(instructors);
        }
    });
};

AppActions.fetchDataForInstructor = function(instructor_id) {
    Async.parallel({
        instructor: function(callback) {
            AppApi.getInstructorById(instructor_id, callback);
        },

        sections: function(callback) {
            AppApi.getSectionsByInstructorId(instructor_id, callback);
        }
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_INSTRUCTOR_DATA,
                instructor_id: instructor_id,
                data: results
            });
        }
    });
};

AppActions.fetchAdvisors = function() {
    AppApi.getAdvisors(function(err, advisors) {
        if (err) {
            console.log(err);
        } else {
            AdvisorListDataStore.updateAdvisors(advisors);
        }
    });
};

AppActions.fetchDataForAdvisor = function(advisor_id) {
    Async.parallel({
        advisor: function(callback) {
            AppApi.getAdvisorById(advisor_id, callback);
        },

        students: function(callback) {
            AppApi.getStudentsByAdvisorId(advisor_id, callback);
        }
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_ADVISOR_DATA,
                advisor_id: advisor_id,
                data: results
            });
        }
    });
};

AppActions.fetchCourses = function() {
    AppApi.getCourses(function(err, courses) {
        if (err) {
            console.log(err);
        } else {
            CourseListDataStore.updateCourses(courses);
        }
    });
};

AppActions.fetchDataForCourse = function(subject, catalog_number) {
    Async.parallel({
        course: function(callback) {
            AppApi.getCourseBySubjectAndCatalogNumber(subject, catalog_number, callback);
        },

        sections: function(callback) {
            AppApi.getSectionsBySubjectAndCatalogNumber(subject, catalog_number, callback);
        }
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_COURSE_DATA,
                subject: subject,
                catalog: catalog_number,
                data: results
            });
        }
    });
};

AppActions.fetchDataForSection = function(term, class_nbr) {
    Async.parallel({
        section: function(callback) {
            AppApi.getSectionByTermAndClassNumber(term, class_nbr, callback);
        },

        students: function(callback) {
            AppApi.getStudentsInSectionByTermAndClassNumber(term, class_nbr, callback);
        }
    }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.RECEIVE_SECTION_DATA,
                term: term,
                class_nbr: class_nbr,
                data: results
            });
        }
    });
};

module.exports = AppActions;
