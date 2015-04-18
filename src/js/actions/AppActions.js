// AppActions.js
'use strict';

var AppApi        = require('../utils/AppApi');
var Async         = require('async');
var _             = require('lodash');

// Data stores
var StudentDataStore    = require('../stores/StudentDataStore');
var InstructorDataStore = require('../stores/InstructorDataStore');
var AdvisorDataStore    = require('../stores/AdvisorDataStore');
var CourseDataStore     = require('../stores/CourseDataStore');
var SectionDataStore    = require('../stores/SectionDataStore');

var AppActions = {};

AppActions.fetchStudents = function() {
    AppApi.getStudents(function(err, students) {
        if (err) {
            console.log(err);
        } else {
            StudentDataStore.updateStudents(students);
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
            StudentDataStore.updateDataForStudent(student_id, results);
        }
    });
};

AppActions.fetchInstructors = function() {
    AppApi.getInstructors(function(err, instructors) {
        if (err) {
            console.log(err);
        } else {
            InstructorDataStore.updateInstructors(instructors);
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
            InstructorDataStore.updateDataForInstructor(instructor_id, results);
        }
    });
};

AppActions.fetchAdvisors = function() {
    AppApi.getAdvisors(function(err, advisors) {
        if (err) {
            console.log(err);
        } else {
            AdvisorDataStore.updateAdvisors(advisors);
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
            AdvisorDataStore.updateDataForAdvisor(advisor_id, results);
        }
    });
};

AppActions.fetchCourses = function() {
    AppApi.getCourses(function(err, courses) {
        if (err) {
            console.log(err);
        } else {
            CourseDataStore.updateCourses(courses);
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
            CourseDataStore.updateDataForCourse(subject, catalog_number, results);
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
            SectionDataStore.updateDataForSection(term, class_nbr, results);
        }
    });
};

module.exports = AppActions;
