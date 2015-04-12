var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
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

function updateDataForAdvisor(advisorId, data) {
    if (!advisorData[advisorId]) {
        advisorData[advisorId] = getInitialAdvisorData();
    }

    _.assign(advisorData[advisorId], data);
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

});

DataStore.dispatcherId = AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
        case AppConstants.RECEIVE_ADVISOR_DATA:
            updateDataForAdvisor(action.advisor_id, action.data);
            DataStore.emitChange();
            break;
        default:
            break;
    }

    return true;
});

module.exports = DataStore;
