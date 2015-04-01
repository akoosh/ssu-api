/** @jsx React.DOM */

var React                   = require('react');
var Bootstrap               = require('react-bootstrap');
var AppActions              = require('../../actions/AppActions');
var DataTable               = require('../subviews/DataTable/DataTable');
var CourseListDataStore     = require('../../stores/CourseListDataStore');

function getViewState() {
    return {
        courses: CourseListDataStore.getCourses()
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
        var formattedCourses = this.state.courses.map(function(course) {
            var units = (course.min_units === course.max_units) ? course.min_units : course.min_units + '-' + course.max_units;
            return {
               subject: course.subject,
               catalog: course.catalog,
               course_title: course.course_title,
               course_units: units
            };
        });

        return (
            <div className='CourseListView'>
                <Bootstrap.PageHeader>Courses</Bootstrap.PageHeader>
                <DataTable data={formattedCourses}/>
            </div>
        );
    }
});

module.exports = CourseListView;
