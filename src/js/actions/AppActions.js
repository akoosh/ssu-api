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

AppActions.instructorListViewDidMount = function() {
    AppDispatcher.handleAction({
        actionType: AppConstants.INITIALIZE_TABLE_DATA,
        tableKey: 'instructors'
    });

    AppApi.getInstructors(function(err, instructors) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.POPULATE_TABLE_DATA,
                data: instructors,
                tableKey: 'instructors'
            });
        }
    });
};

AppActions.instructorListViewWillUnmount = function() {
    AppDispatcher.handleAction({
        actionType: AppConstants.DESTROY_TABLE_DATA,
        tableKey: 'instructors'
    });
};

AppActions.advisorListViewDidMount = function() {
    AppDispatcher.handleAction({
        actionType: AppConstants.INITIALIZE_TABLE_DATA,
        tableKey: 'advisors'
    });

    AppApi.getAdvisors(function(err, advisors) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.POPULATE_TABLE_DATA,
                data: advisors,
                tableKey: 'advisors'
            });
        }
    });
};

AppActions.advisorListViewWillUnmount = function() {
    AppDispatcher.handleAction({
        actionType: AppConstants.DESTROY_TABLE_DATA,
        tableKey: 'advisors'
    });
};

AppActions.courseListViewDidMount = function() {
    AppDispatcher.handleAction({
        actionType: AppConstants.INITIALIZE_TABLE_DATA,
        tableKey: 'courses'
    });

    AppApi.getCourses(function(err, courses) {
        if (err) {
            console.log(err);
        } else {
            AppDispatcher.handleAction({
                actionType: AppConstants.POPULATE_TABLE_DATA,
                data: courses,
                tableKey: 'courses'
            });
        }
    });
};

AppActions.courseListViewWillUnmount = function() {
    AppDispatcher.handleAction({
        actionType: AppConstants.DESTROY_TABLE_DATA,
        tableKey: 'courses'
    });
};

AppActions.updateTableData = function(tableKey, tableData) {
    AppDispatcher.handleAction(_.assign(tableData, {
        actionType: AppConstants.UPDATE_TABLE_DATA,
        tableKey: tableKey
    }));
};

AppActions.searchTableData = function(tableKey, searchParams) {
    AppDispatcher.handleAction(_.assign(searchParams, {
        actionType: AppConstants.SEARCH_TABLE_DATA,
        tableKey: tableKey
    }));
};

AppActions.sortTableData = function(tableKey, sortParams) {
    AppDispatcher.handleAction(_.assign(sortParams, {
        actionType: AppConstants.SORT_TABLE_DATA,
        tableKey: tableKey
    }));
};

module.exports = AppActions;
