var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var AppApi        = require('../utils/AppApi');
var _             = require('lodash');

var AppActions = {};

AppActions.getData = function(type) {
    switch(type) {
        case 'students':
            AppApi.getStudents();
            break;
        case 'instructors':
            AppApi.getInstructors();
            break;
        case 'advisors':
            AppApi.getAdvisors();
            break;
        case 'courses':
            AppApi.getCourses();
            break;
        default:
            break;
    }
};

AppActions.updateTableData = function(tableData) {
    AppDispatcher.handleAction(_.assign(tableData, {
        actionType: AppConstants.UPDATE_TABLE_DATA
    }));
};

AppActions.searchTableData = function(searchParams) {
    AppDispatcher.handleAction(_.assign(searchParams, {
        actionType: AppConstants.SEARCH_TABLE_DATA
    }));
};

AppActions.sortTableData = function(sortParams) {
    AppDispatcher.handleAction(_.assign(sortParams, {
        actionType: AppConstants.SORT_TABLE_DATA
    }));
};

module.exports = AppActions;
