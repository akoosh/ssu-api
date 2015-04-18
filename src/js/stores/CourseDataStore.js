// CourseDataStore.js
'use strict';

var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var courseData = {};

function getInitialCourseData() {
    return {
        course: {},
        sections: []
    };
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

    updateDataForCourse: function(subject, catalog, data) {
        var courseKey = subject + catalog;
        if (!courseData[courseKey]) {
            courseData[courseKey] = getInitialCourseData();
        }

        _.assign(courseData[courseKey], data);
        this.emitChange();
    }
});

module.exports = DataStore;
