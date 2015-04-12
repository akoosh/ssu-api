var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
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

function updateDataForStudent(studentId, data) {
    if (!studentData[studentId]) {
        studentData[studentId] = getInitialStudentData();
    }

    _.assign(studentData[studentId], data);
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

});

DataStore.dispatcherId = AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
        case AppConstants.RECEIVE_STUDENT_DATA:
            updateDataForStudent(action.student_id, action.data);
            DataStore.emitChange();
            break;
        default:
            break;
    }

    return true;
});

module.exports = DataStore;
