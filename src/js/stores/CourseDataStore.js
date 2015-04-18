// CourseDataStore.js
'use strict';

var DataStoreUtils  = require('../utils/DataStoreUtils');
var _             = require('lodash');

var courseData = {};

function getInitialCourseData() {
    return {
        course: {},
        sections: []
    };
}

function updateDataForCourse(subject, catalog, data) {
    var courseKey = subject + catalog;
    if (!courseData[courseKey]) {
        courseData[courseKey] = getInitialCourseData();
    }

    _.assign(courseData[courseKey], data);
}

var DataStore = DataStoreUtils.createDataStore({

    getDataForCourse: function(subject, catalog) {
        return courseData[subject + catalog] || getInitialCourseData();
    },

    hasDataForCourse: function(subject, catalog) {
        var data = courseData[subject + catalog];
        if (data) {
            return Boolean(data.sections.length);
        } else {
            return false;
        }
    },

    getAllCourses: function() {
        return _.pluck(courseData, 'course');
    },

    getCourseBySubjectAndCatalogNumber: function(subject, catalog) {
        var courseKey = subject + catalog;
        return (courseData[courseKey] || {}).course || {};
    },

    updateDataForCourse: function(subject, catalog, data) {
        updateDataForCourse(subject, catalog, data);
        this.emitChange();
    },

    updateCourses: function(courses) {
        courses.forEach(function(course) {
            updateDataForCourse(course.subject, course.catalog, {course: course});
        });
        this.emitChange();
    }
});

module.exports = DataStore;
