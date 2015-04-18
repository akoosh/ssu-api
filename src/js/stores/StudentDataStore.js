// StudentDataStore.js
'use strict';

var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var studentData = {};

function getInitialStudentData() {
    return {
        student: {},
        advisors: [],
        sections: []
    };
}

var DataStore = _.assign({}, EventEmitter.prototype, {

    getDataForStudent: function(studentId) {
        return studentData[studentId] || getInitialStudentData();
    },

    hasDataForStudent: function(studentId) {
        return Boolean(studentData[studentId]);
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

    updateDataForStudent: function(studentId, data) {
        if (!studentData[studentId]) {
            studentData[studentId] = getInitialStudentData();
        }

        _.assign(studentData[studentId], data);
        this.emitChange();
    }
});

module.exports = DataStore;
