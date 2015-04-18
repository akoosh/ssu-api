// CourseListDataStore.js
'use strict';

var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var courses = [];

var DataStore = _.assign({}, EventEmitter.prototype, {

    getCourses: function() {
        return courses;
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

    updateCourses: function(newCourses) {
        courses = newCourses;
        this.emitChange();
    }
});

module.exports = DataStore;
