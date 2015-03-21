/** @jsx React.DOM */

var React                   = require('react');
var Bootstrap               = require('react-bootstrap');
var AppActions              = require('../../actions/AppActions');
var DataTableDataStore      = require('../../stores/DataTableDataStore');
var DataTable               = require('../subviews/DataTable/DataTable');

function getViewState() {
    return {
        tableState: DataTableDataStore.getStateForKey('courses')
    };
}

var CourseListView = React.createClass({

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        DataTableDataStore.addChangeListener(this.onChange);
        AppActions.courseListViewDidMount();
    },

    componentWillUnmount: function() {
        DataTableDataStore.removeChangeListener(this.onChange);
        AppActions.courseListViewWillUnmount();
    },

    render: function() {
        return (
            <div className='CourseListView'>
                <Bootstrap.PageHeader>Courses</Bootstrap.PageHeader>
                <DataTable tableKey='courses' {...this.state.tableState} />
            </div>
        );
    }
});

module.exports = CourseListView;
