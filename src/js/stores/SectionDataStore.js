// SectionDataStore.js
'use strict';

var DataStoreUtils  = require('../utils/DataStoreUtils');
var _             = require('lodash');

var sectionData = {};

function getInitialSectionData() {
    return {
        section: {},
        students: []
    };
}

var DataStore = DataStoreUtils.createDataStore({

    getDataForSection: function(term, class_nbr) {
        return sectionData[term + class_nbr] || getInitialSectionData();
    },

    hasDataForSection: function(term, class_nbr) {
        return Boolean(sectionData[term + class_nbr]);
    },

    getSectionDataForCourse: function(subject, catalog) {
        return _.values(sectionData).map(function(data) {
            return data.section.course.subject === subject && data.section.course.catalog === catalog;
        });
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
