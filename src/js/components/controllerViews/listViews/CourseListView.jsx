// CourseListView.jsx
'use strict';

var React           = require('react');
var Router          = require('react-router');
var Bootstrap       = require('react-bootstrap');
var AppActions      = require('../../../actions/AppActions');
var DataTable       = require('../../subviews/DataTable/DataTable');
var CourseDataStore = require('../../../stores/CourseDataStore');

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

function getViewState() {
    return {
        courses: formattedCourses(CourseDataStore.getAllCourses())
    };
}

var CourseListView = React.createClass({

    mixins: [Router.Navigation],

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        CourseDataStore.addChangeListener(this.onChange);
        AppActions.fetchCourses();
    },

    componentWillUnmount: function() {
        CourseDataStore.removeChangeListener(this.onChange);
    },

    onRowClick: function(course) {
        this.transitionTo('course-detail', {subject: course.subject, catalog_number: course.catalog});
    },

    render: function() {
        return (
            <div className='CourseListView'>
                <Bootstrap.PageHeader>Courses</Bootstrap.PageHeader>
                <DataTable data={this.state.courses} onRowClick={this.onRowClick}/>
            </div>
        );
    }
});

module.exports = CourseListView;
