// DataStoreUtils.js
'use strict';

var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

function createDataStore(context) {

    var DataStore = _.assign(context, EventEmitter.prototype, {

        addChangeListener: function(callback) {
            this.on('change', callback);
        },

        removeChangeListener: function(callback) {
            this.removeListener('change', callback);
        },

        emitChange: function() {
            this.emit('change');
        }

    });

    return DataStore;
}

module.exports = {
    createDataStore: createDataStore
};
