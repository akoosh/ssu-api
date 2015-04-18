// InstructorListDataStore.js
'use strict';

var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var instructors = [];

var DataStore = _.assign({}, EventEmitter.prototype, {

    getInstructors: function() {
        return instructors;
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

    updateInstructors: function(newInstructors) {
        instructors = newInstructors;
        this.emitChange();
    }
});

module.exports = DataStore;
