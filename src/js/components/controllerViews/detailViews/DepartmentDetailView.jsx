// DepartmentDetailView.jsx
'use strict';

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var CourseDataStore     = require('../../../stores/CourseDataStore');

function formattedCourses(courses) {
    return courses.map(function(course) {
        var units = (course.min_units === course.max_units) ? course.min_units : course.min_units + '-' + course.max_units;
        return {
           subject: course.subject,
           catalog: course.catalog,
           course_title: course.course_title,
           course_units: units
        };
    });
}

var DepartmentDetailView = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function() {
        return this.getViewState();
    },

    getViewState: function() {
        return {
            courses: formattedCourses(CourseDataStore.getCoursesBySubject(this.getParams().subject))
        };
    },

    onChange: function() {
        this.setState(this.getViewState());
    },

    componentDidMount: function() {
        CourseDataStore.addChangeListener(this.onChange);
        AppActions.fetchCourses();
    },

    componentWillUnmount: function() {
        CourseDataStore.removeChangeListener(this.onChange);
    },

    render: function() {
        return (
            <div className='DepartmentDetailView'>
                <Bootstrap.PageHeader>{this.getParams().subject} Department</Bootstrap.PageHeader>
                <DataTable simple data={this.state.courses}/>
            </div>
        );
    }
});

module.exports = DepartmentDetailView;
