// AdvisorListDataStore.js
'use strict';

var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var advisors = [];

var DataStore = _.assign({}, EventEmitter.prototype, {

    getAdvisors: function() {
        return advisors;
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

    updateAdvisors: function(newAdvisors) {
        advisors = newAdvisors;
        this.emitChange();
    }
});

module.exports = DataStore;
