var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var sectionData = {};

function getInitialSectionData() {
    return {
        section: {},
        students: []
    };
}

function updateDataForSection(sectionKey, data) {
    if (!sectionData[sectionKey]) {
        sectionData[sectionKey] = getInitialSectionData();
    }

    _.assign(sectionData[sectionKey], data);
}

var DataStore = _.assign({}, EventEmitter.prototype, {

    getDataForSection: function(term, class_nbr) {
        return sectionData[term + class_nbr] || getInitialSectionData();
    },

    hasDataForSection: function(term, class_nbr) {
        return Boolean(sectionData[term + class_nbr]);
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
        case AppConstants.RECEIVE_SECTION_DATA:
            updateDataForSection(action.term + action.class_nbr, action.data);
            DataStore.emitChange();
            break;
        default:
            break;
    }

    return true;
});

module.exports = DataStore;
