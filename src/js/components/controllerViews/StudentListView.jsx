/** @jsx React.DOM */

var React                   = require('react');
var Bootstrap               = require('react-bootstrap');
var AppActions              = require('../../actions/AppActions');
var DataTableDataStore      = require('../../stores/DataTableDataStore');
var DataTable               = require('../subviews/DataTable/DataTable');

function getViewState() {
    return {
        tableState: DataTableDataStore.getStateForKey('students')
    };
}

var StudentListView = React.createClass({

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        DataTableDataStore.addChangeListener(this.onChange);
        AppActions.studentListViewDidMount();
    },

    componentWillUnmount: function() {
        DataTableDataStore.removeChangeListener(this.onChange);
        AppActions.studentListViewWillUnmount();
    },

    render: function() {
        return (
            <div className='StudentListView'>
                <Bootstrap.PageHeader>Students</Bootstrap.PageHeader>
                <DataTable tableKey='students' {...this.state.tableState} />
            </div>
        );
    }
});

module.exports = StudentListView;
