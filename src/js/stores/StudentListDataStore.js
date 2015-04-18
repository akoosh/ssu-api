// StudentListDataStore.js
'use strict';

var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var students = [];

var DataStore = _.assign({}, EventEmitter.prototype, {

    getStudents: function() {
        return students;
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

    updateStudents: function(newStudents) {
        students = newStudents;
        this.emitChange();
    }
});

module.exports = DataStore;
