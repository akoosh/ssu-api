/** @jsx React.DOM */

var React                   = require('react');
var Bootstrap               = require('react-bootstrap');
var AppActions              = require('../../actions/AppActions');
var DataTable               = require('../subviews/DataTable/DataTable');
var CourseListDataStore     = require('../../stores/CourseListDataStore');

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
        courses: formattedCourses(CourseListDataStore.getCourses())
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
        CourseListDataStore.addChangeListener(this.onChange);
        AppActions.fetchCourses();
    },

    componentWillUnmount: function() {
        CourseListDataStore.removeChangeListener(this.onChange);
    },

    render: function() {
        return (
            <div className='CourseListView'>
                <Bootstrap.PageHeader>Courses</Bootstrap.PageHeader>
                <DataTable data={this.state.courses}/>
            </div>
        );
    }
});

module.exports = CourseListView;
