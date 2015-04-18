// StudentDataStore.js
'use strict';

var DataStoreUtils  = require('../utils/DataStoreUtils');
var _             = require('lodash');

var studentData = {};

function getInitialStudentData() {
    return {
        student: {},
        advisors: [],
        sections: []
    };
}

function updateDataForStudent(studentId, data) {
    if (!studentData[studentId]) {
        studentData[studentId] = getInitialStudentData();
    }

    _.assign(studentData[studentId], data);
}

var DataStore = DataStoreUtils.createDataStore({

    getDataForStudent: function(studentId) {
        return studentData[studentId] || getInitialStudentData();
    },

    hasDataForStudent: function(studentId) {
        var data = studentData[studentId];
        if (data) {
            return Boolean(data.advisors.length && data.sections.length);
        } else {
            return false;
        }
    },

    getAllStudents: function() {
        return _.pluck(studentData, 'student');
    },

    getStudentById: function(studentId) {
        return (studentData[studentId] || {}).student || {};
    },

    updateDataForStudent: function(studentId, data) {
        updateDataForStudent(studentId, data);
        this.emitChange();
    },

    updateStudents: function(students) {
        students.forEach(function(student) {
            updateDataForStudent(student.student_id, {student: student});
        });
        this.emitChange();
    }
});

module.exports = DataStore;
