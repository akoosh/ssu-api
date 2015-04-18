// AdvisorDataStore.js
'use strict';

var DataStoreUtils  = require('../utils/DataStoreUtils');
var _             = require('lodash');

var advisorData = {};

function getInitialAdvisorData() {
    return {
        advisor: {},
        students: []
    };
}

function updateDataForAdvisor(advisorId, data) {
    if (!advisorData[advisorId]) {
        advisorData[advisorId] = getInitialAdvisorData();
    }

    _.assign(advisorData[advisorId], data);
}

var DataStore = DataStoreUtils.createDataStore({

    getDataForAdvisor: function(advisorId) {
        return advisorData[advisorId] || getInitialAdvisorData();
    },

    hasDataForAdvisor: function(advisorId) {
        var data = advisorData[advisorId];
        if (data) {
            return Boolean(data.students.length);
        } else {
            return false;
        }
    },

    getAllAdvisors: function() {
        var advisors = _.pluck(advisorData, 'advisor');
        return advisors;
    },

    getAdvisorById: function(advisorId) {
        return (advisorData[advisorId] || {}).advisor || {};
    },

    updateDataForAdvisor: function(advisorId, data) {
        updateDataForAdvisor(advisorId, data);
        this.emitChange();
    },

    updateAdvisors: function(advisors) {
        advisors.forEach(function(advisor) {
            updateDataForAdvisor(advisor.faculty_id, {advisor: advisor});
        });
        this.emitChange();
    }
});

module.exports = DataStore;
