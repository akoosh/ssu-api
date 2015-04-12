var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var courseData = {};

function getInitialCourseData() {
    return {
        course: {},
        sections: []
    };
}

function updateDataForCourse(courseKey, data) {
    if (!courseData[courseKey]) {
        courseData[courseKey] = getInitialCourseData();
    }

    _.assign(courseData[courseKey], data);
}

var DataStore = _.assign({}, EventEmitter.prototype, {

    getDataForCourse: function(subject, catalog) {
        return courseData[subject + catalog] || getInitialCourseData();
    },

    hasDataForCourse: function(subject, catalog) {
        return Boolean(courseData[subject + catalog]);
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
        case AppConstants.RECEIVE_COURSE_DATA:
            updateDataForCourse(action.subject + action.catalog, action.data);
            DataStore.emitChange();
            break;
        default:
            break;
    }

    return true;
});

module.exports = DataStore;
