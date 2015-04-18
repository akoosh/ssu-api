// InstructorDataStore.js
'use strict';

var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var instructorData = {};

function getInitialInstructorData() {
    return {
        instructor: {},
        sections: []
    };
}

var DataStore = _.assign({}, EventEmitter.prototype, {

    getDataForInstructor: function(instructorId) {
        return instructorData[instructorId] || getInitialInstructorData();
    },

    hasDataForInstructor: function(instructorId) {
        return Boolean(instructorData[instructorId]);
    },

    emitChange: function() {
        this.emit('change');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    },

    updateDataForInstructor: function(instructorId, data) {
        if (!instructorData[instructorId]) {
            instructorData[instructorId] = getInitialInstructorData();
        }

        _.assign(instructorData[instructorId], data);
        this.emitChange();
    }
});

module.exports = DataStore;
