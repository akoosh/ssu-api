var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var studentData = {
    student: {},
    advisors: [],
    sections: []
};

var DataStore = _.assign({}, EventEmitter.prototype, {

    getStudentData: function() {
        return studentData;
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
        case AppConstants.RECEIVE_STUDENT:
            studentData.student = action.student;
            DataStore.emitChange();
            break;
        case AppConstants.RECEIVE_STUDENT_ADVISORS:
            studentData.advisors = action.advisors;
            DataStore.emitChange();
            break;
        case AppConstants.RECEIVE_STUDENT_SECTIONS:
            studentData.sections = action.sections;
            DataStore.emitChange();
            break;
        default:
            break;
    }

    return true;
});

module.exports = DataStore;
