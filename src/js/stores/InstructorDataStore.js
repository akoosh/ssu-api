var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var EventEmitter  = require('events').EventEmitter;
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

});

DataStore.dispatcherId = AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
        case AppConstants.RECEIVE_INSTRUCTOR_DATA:
            updateDataForInstructor(action.instructor_id, action.data);
            DataStore.emitChange();
            break;
        default:
            break;
    }

    return true;
});

module.exports = DataStore;
