// InstructorDataStore.js
'use strict';

var DataStoreUtils  = require('../utils/DataStoreUtils');
var _             = require('lodash');

var instructorData = {};

function getInitialInstructorData() {
    return {
        instructor: {},
        sections: []
    };
}

function updateDataForInstructor(instructorId, data) {
    if (!instructorData[instructorId]) {
        instructorData[instructorId] = getInitialInstructorData();
    }

    _.assign(instructorData[instructorId], data);
}

var DataStore = DataStoreUtils.createDataStore({

    getDataForInstructor: function(instructorId) {
        return instructorData[instructorId] || getInitialInstructorData();
    },

    hasDataForInstructor: function(instructorId) {
        var data = instructorData[instructorId];
        if (data) {
            return Boolean(data.sections.length);
        } else {
            return false;
        }
    },

    getAllInstructors: function() {
        return _.pluck(instructorData, 'instructor');
    },

    getInstructorById: function(instructorId) {
        return (instructorData[instructorId] || {}).instructor || {};
    },

    updateDataForInstructor: function(instructorId, data) {
        updateDataForInstructor(instructorId, data);
        this.emitChange();
    },

    updateInstructors: function(instructors) {
        instructors.forEach(function(instructor) {
            updateDataForInstructor(instructor.faculty_id, {instructor: instructor});
        });
        this.emitChange();
    }
});

module.exports = DataStore;
