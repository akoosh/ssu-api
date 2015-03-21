/** @jsx React.DOM */

var React                   = require('react');
var Bootstrap               = require('react-bootstrap');
var AppActions              = require('../../actions/AppActions');
var DataTableDataStore      = require('../../stores/DataTableDataStore');
var DataTable               = require('../views/DataTable/DataTable');

function getViewState() {
    return {
        tableState: DataTableDataStore.getStateForKey('instructors')
    };
}

var InstructorListView = React.createClass({

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        DataTableDataStore.addChangeListener(this.onChange);
        AppActions.instructorListViewDidMount();
    },

    componentWillUnmount: function() {
        DataTableDataStore.removeChangeListener(this.onChange);
        AppActions.instructorListViewWillUnmount();
    },

    render: function() {
        return (
            <div className='InstructorListView'>
                <Bootstrap.PageHeader>Instructors</Bootstrap.PageHeader>
                <DataTable tableKey='instructors' {...this.state.tableState} />
            </div>
        );
    }
});

module.exports = InstructorListView;
