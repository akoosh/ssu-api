// InstructorListView.jsx
'use strict';

var React               = require('react');
var Router              = require('react-router');
var Bootstrap           = require('react-bootstrap');
var AppActions          = require('../../../actions/AppActions');
var DataTable           = require('../../subviews/DataTable/DataTable');
var InstructorDataStore = require('../../../stores/InstructorDataStore');

function getViewState() {
    return {
        instructors: InstructorDataStore.getAllInstructors()
    };
}

var InstructorListView = React.createClass({

    mixins: [Router.Navigation],

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        InstructorDataStore.addChangeListener(this.onChange);
        AppActions.fetchInstructors();
    },

    componentWillUnmount: function() {
        InstructorDataStore.removeChangeListener(this.onChange);
    },

    onRowClick: function(instructor) {
        this.transitionTo('instructor-detail', {instructor_id: instructor.faculty_id});
    },

    render: function() {
        return (
            <div className='InstructorListView'>
                <Bootstrap.PageHeader>Instructors</Bootstrap.PageHeader>
                <DataTable clickable data={this.state.instructors} onRowClick={this.onRowClick}/>
            </div>
        );
    }
});

module.exports = InstructorListView;
