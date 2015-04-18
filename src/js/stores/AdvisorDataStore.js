// AdvisorDataStore.js
'use strict';

var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var advisorData = {
    advisor: {},
    students: []
};

function getInitialAdvisorData() {
    return {
        advisor: {},
        students: []
    };
}

var DataStore = _.assign({}, EventEmitter.prototype, {

    getDataForAdvisor: function(advisorId) {
        return advisorData[advisorId] || getInitialAdvisorData();
    },

    hasDataForAdvisor: function(advisorId) {
        return Boolean(advisorData[advisorId]);
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

    updateDataForAdvisor: function(advisorId, data) {
        if (!advisorData[advisorId]) {
            advisorData[advisorId] = getInitialAdvisorData();
        }

        _.assign(advisorData[advisorId], data);
        this.emitChange();
    }
});

module.exports = DataStore;
