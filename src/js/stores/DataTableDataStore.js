var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var state = {
    data: [],
    dataType: '',
    columns: [],
    pageNum: 0,
    perPage: 15,
    searchData: [],
    searchQuery: '',
    sortKey: null, 
    sortOrder: 0
};

function updateState(tableData) {
    _.assign(state, tableData);
}

// I'm not actually sure if this should go here, or in an action.
// This is a store, and probably shouldn't do much logic.
function updateDerivedState() {
    // columns are derived from data
    var columns = [];
    if (state.data.length > 0) {
        var keys = Object.keys(state.data[0]);
        columns = keys.map(function(key) {
            return {
                key: key,
                label: nameFromKey(key)
            };
        });
    }

    state.columns = columns;
    
    // reset the searching and sorting info
    state.searchData = state.data;
    state.searchQuery = '';
    state.sortKey = null;
    state.sortOrder = 0;
}

function updatePagificationState() {
    state.pageNum = 0;
}

function searchTableData() {
    // Create a regex for each word in the query
    var patterns = state.searchQuery.trim().split(' ').map(function(param) {
        return new RegExp(param, 'i');
    });

    // Keep items that have at least one match for each regex
    state.searchData = state.data.filter(function(datum) {
        return _.every(patterns, function(pattern) {
            return _.some(datum, function(prop) {
                return prop.match(pattern);
            });
        });
    });
}

function sortTableData() {
    var key = state.sortKey;
    state.data.sort(function(a,b) {
        return a[key].localeCompare(b[key]) * state.sortOrder;
    });
}

function nameFromKey(key) {
    // This function turns something like 'first_name' into something like 'First Name'
    return key.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

// Merge our store with Node's Event Emitter
var DataStore = _.assign({}, EventEmitter.prototype, {
    
    getState: function() {
        return state;
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
        case AppConstants.RECEIVE_DATA:
            updateState(_.omit(action, 'actionType'));
            updateDerivedState();
            DataStore.emitChange();
            break;
        case AppConstants.UPDATE_TABLE_DATA:
            updateState(_.omit(action, 'actionType'));
            DataStore.emitChange();
            break;
        case AppConstants.SORT_TABLE_DATA:
            updateState(_.omit(action, 'actionType'));
            sortTableData();
            DataStore.emitChange();
            break;
        case AppConstants.SEARCH_TABLE_DATA:
            updateState(_.omit(action, 'actionType'));
            searchTableData();
            updatePagificationState();
            DataStore.emitChange();
            break;
        default:
            break;
    }

    return true;
});

module.exports = DataStore;
