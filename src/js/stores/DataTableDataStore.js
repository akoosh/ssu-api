var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var state = {
    dataType: '',
    data: [],
    columns: [],
    perPage: 15
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
}

function nameFromKey(key) {
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
        default:
            break;
    }

    return true;
});

module.exports = DataStore;
