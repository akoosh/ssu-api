// SectionDataStore.js
'use strict';

var EventEmitter  = require('events').EventEmitter;
var _             = require('lodash');

var sectionData = {};

function getInitialSectionData() {
    return {
        section: {},
        students: []
    };
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

    updateDataForSection: function(term, class_number, data) {
        var sectionKey =  term + class_number;
        if (!sectionData[sectionKey]) {
            sectionData[sectionKey] = getInitialSectionData();
        }

        _.assign(sectionData[sectionKey], data);
        this.emitChange();
    }
});

module.exports = DataStore;
