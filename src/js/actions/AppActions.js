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


function fetchStudents() {
    AppApi.getStudents(function(err, students) {
        if (err) {
            console.log(err);
        } else {
            StudentDataStore.updateStudents(students);
        }
    });
}

function fetchDataForStudent(student_id) {
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
}

function fetchInstructors() {
    AppApi.getInstructors(function(err, instructors) {
        if (err) {
            console.log(err);
        } else {
            InstructorDataStore.updateInstructors(instructors);
        }
    });
}

function fetchDataForInstructor(instructor_id) {
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
}

function fetchAdvisors() {
    AppApi.getAdvisors(function(err, advisors) {
        if (err) {
            console.log(err);
        } else {
            AdvisorDataStore.updateAdvisors(advisors);
        }
    });
}

function fetchDataForAdvisor(advisor_id) {
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
}

function fetchCourses() {
    AppApi.getCourses(function(err, courses) {
        if (err) {
            console.log(err);
        } else {
            CourseDataStore.updateCourses(courses);
        }
    });
}

function fetchDataForCourse(subject, catalog_number) {
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
}

function fetchDataForSection(term, class_nbr) {
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
}

module.exports = {
    fetchStudents:              fetchStudents,
    fetchDataForStudent:        fetchDataForStudent,
    fetchInstructors:           fetchInstructors,
    fetchDataForInstructor:     fetchDataForInstructor,
    fetchAdvisors:              fetchAdvisors,
    fetchDataForAdvisor:        fetchDataForAdvisor,
    fetchCourses:               fetchCourses,
    fetchDataForCourse:         fetchDataForCourse,
    fetchDataForSection:        fetchDataForSection
};
