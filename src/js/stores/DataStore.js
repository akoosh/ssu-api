var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

// Internal variable for data. Named with an underscore by convention
var _data = [], _type = '';

function loadData(data, type) {
    _data = data;
    _type = type;
}

// Merge our store with Node's Event Emitter
var DataStore = _.extend({}, EventEmitter.prototype, {
    
    getData: function() {
        return _data;
    },

    getDataType: function() {
        return _type;
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
            loadData(action.data, action.dataType);
            DataStore.emitChange();
            break;
        default:
            break;
    }

    return true;
});

module.exports = DataStore;
