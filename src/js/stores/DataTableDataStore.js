var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var tableStates = {};

function getInitialState() {
    return {
        columns: [],
        dataType: '',
        data: [],
        searchData: [],
        searchQuery: '',
        pageData: [],
        pageNum: 0,
        numPages: 0,
        perPage: 15,
        sortKey: null, 
        sortOrder: 0
    };
}

function initializeTableData(tableKey) {
    tableStates[tableKey] = getInitialState();
}

function updateState(tableKey, tableData) {
    var state = tableStates[tableKey];
    if (state) {
        _.assign(state, tableData);
    } else {
        console.warn('Table state not found for key: ' + tableKey);
    }
}

function updateDerivedState(tableKey) {
    var state = tableStates[tableKey];
    if (state) {
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
    } else {
        console.warn('Table state not found for key: ' + tableKey);
    }
}

function searchTableData(tableKey) {
    var state = tableStates[tableKey];
    if (state) {
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
    } else {
        console.warn('Table state not found for key: ' + tableKey);
    }
}

function updatePagificationState(tableKey) {
    var state = tableStates[tableKey];
    if (state) {
        state.pageNum = 0;
    } else {
        console.warn('Table state not found for key: ' + tableKey);
    }
}

function pagifyData(tableKey) {
    var state = tableStates[tableKey];
    if (state) {
        var begin = state.perPage * state.pageNum;
        var end = begin + state.perPage;

        end = end < state.searchData.length ? end : state.searchData.length;

        state.pageData = state.searchData.slice(begin, end);
        state.numPages = state.searchData.length / state.perPage;
    } else {
        console.warn('Table state not found for key: ' + tableKey);
    }
}

function sortTableData(tableKey) {
    var state = tableStates[tableKey];
    if (state) {
        var key = state.sortKey;

        if (key) {
            state.data.sort(function(a,b) {
                return a[key].localeCompare(b[key]) * state.sortOrder;
            });

            searchTableData(tableKey);
        }
    } else {
        console.warn('Table state not found for key: ' + tableKey);
    }
}

function destroyDataForKey(tableKey) {
    delete tableStates[tableKey];
}

function nameFromKey(key) {
    // This function turns something like 'first_name' into something like 'First Name'
    return key.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

// Merge our store with Node's Event Emitter
var DataStore = _.assign({}, EventEmitter.prototype, {
    
    getStateForKey: function(key) {
        var state = tableStates[key];

        if (state) {
            pagifyData(key);
            state = _.omit(_.omit(state, 'data'), 'searchData');
        } else {
            state = getInitialState();
        }

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
    var actionType = action.actionType;
    var tableKey = action.tableKey;

    var data = _.omit(_.omit(action, 'actionType'), 'tableKey');

    switch(actionType) {
        case AppConstants.INITIALIZE_TABLE_DATA:
            initializeTableData(tableKey);
            DataStore.emitChange();
            break;
        case AppConstants.POPULATE_TABLE_DATA:
            updateState(tableKey, data);
            updateDerivedState(tableKey);
            DataStore.emitChange();
            break;
        case AppConstants.UPDATE_TABLE_DATA:
            updateState(tableKey, data);
            DataStore.emitChange();
            break;
        case AppConstants.SORT_TABLE_DATA:
            updateState(tableKey, data);
            sortTableData(tableKey);
            DataStore.emitChange();
            break;
        case AppConstants.SEARCH_TABLE_DATA:
            updateState(tableKey, data);
            searchTableData(tableKey);
            updatePagificationState(tableKey);
            DataStore.emitChange();
            break;
        case AppConstants.DESTROY_TABLE_DATA:
            destroyDataForKey(tableKey);
            DataStore.emitChange();
            break;
        default:
            break;
    }

    return true;
});

module.exports = DataStore;
