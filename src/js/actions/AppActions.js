var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');
var AppApi        = require('../utils/AppApi');
var _             = require('lodash');

var AppActions = {};

AppActions.studentListViewDidMount = function() {
    AppDispatcher.handleAction({
        actionType: AppConstants.INITIALIZE_TABLE_DATA,
        tableKey: 'students'
    });

    AppApi.getStudents(function(err, students) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.POPULATE_TABLE_DATA,
                data: students,
                tableKey: 'students'
            });
        }
    });
};

AppActions.studentListViewWillUnmount = function() {
    AppDispatcher.handleAction({
        actionType: AppConstants.DESTROY_TABLE_DATA,
        tableKey: 'students'
    });
};

AppActions.updateTableData = function(tableKey, tableData) {
    AppDispatcher.handleAction(_.assign(tableData, {
        actionType: AppConstants.UPDATE_TABLE_DATA,
        tableKey: 'students'
    }));
};

AppActions.searchTableData = function(tableKey, searchParams) {
    AppDispatcher.handleAction(_.assign(searchParams, {
        actionType: AppConstants.SEARCH_TABLE_DATA,
        tableKey: 'students'
    }));
};

AppActions.sortTableData = function(tableKey, sortParams) {
    AppDispatcher.handleAction(_.assign(sortParams, {
        actionType: AppConstants.SORT_TABLE_DATA,
        tableKey: 'students'
    }));
};

module.exports = AppActions;
