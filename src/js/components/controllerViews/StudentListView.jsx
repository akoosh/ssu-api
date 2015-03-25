/** @jsx React.DOM */

var React                   = require('react');
var Bootstrap               = require('react-bootstrap');
var AppActions              = require('../../actions/AppActions');
var DataTable               = require('../subviews/DataTable/DataTable');
var StudentListDataStore    = require('../../stores/StudentListDataStore');

function getViewState() {
    return {
        students: StudentListDataStore.getStudents()
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
        StudentListDataStore.addChangeListener(this.onChange);
        AppActions.fetchStudents();
    },

    componentWillUnmount: function() {
        StudentListDataStore.removeChangeListener(this.onChange);
    },

    render: function() {
        return (
            <div className='StudentListView'>
                <Bootstrap.PageHeader>Students</Bootstrap.PageHeader>
                <DataTable data={this.state.students}/>
            </div>
        );
    }
});

module.exports = StudentListView;
