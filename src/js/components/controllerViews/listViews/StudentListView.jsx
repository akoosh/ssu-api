/** @jsx React.DOM */

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var StudentListDataStore    = require('../../../stores/StudentListDataStore');

function getViewState() {
    return {
        students: StudentListDataStore.getStudents()
    };
}

var StudentListView = React.createClass({

    mixins: [Router.Navigation],

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

    onRowClick: function(student) {
        this.transitionTo('student-detail', {student_id: student.student_id});
    },

    render: function() {
        return (
            <div className='StudentListView'>
                <Bootstrap.PageHeader>Students</Bootstrap.PageHeader>
                <DataTable clickable data={this.state.students} onRowClick={this.onRowClick}/>
            </div>
        );
    }
});

module.exports = StudentListView;
