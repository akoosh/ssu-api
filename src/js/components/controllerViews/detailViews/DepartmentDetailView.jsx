// DepartmentDetailView.jsx
'use strict';

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var DataTable               = require('../../subviews/DataTable/DataTable');
var AppActions              = require('../../../actions/AppActions');
var CourseDataStore         = require('../../../stores/CourseDataStore');

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

function coursesByLevel(courses) {
    return _.groupBy(courses, function(course) {
        return course.catalog[0] + '00-level';
    });
}

var DepartmentDetailView = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function() {
        return this.getViewState();
    },

    getViewState: function() {
        var courses = formattedCourses(CourseDataStore.getCoursesBySubject(this.getParams().subject));
        return {
            courses: courses,
            coursesByLevel: coursesByLevel(courses)
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

    onCourseClick: function(course) {
        this.transitionTo('course-detail', {subject: course.subject, catalog_number: course.catalog});
    },

    render: function() {
        console.log('rendering with state:');
        console.log(this.state);
        return (
            <div className='DepartmentDetailView'>
                <Bootstrap.PageHeader>{this.getParams().subject} Department</Bootstrap.PageHeader>

                <Bootstrap.TabbedArea defaultActiveKey={0}>
                    <Bootstrap.TabPane eventKey={0} tab='All'>
                        <DataTable simple clickable data={this.state.courses} onRowClick={this.onCourseClick}/>
                    </Bootstrap.TabPane>

                    {Object.keys(this.state.coursesByLevel).map(function(level, i) {
                        return (
                            <Bootstrap.TabPane key={i} eventKey={i + 1} tab={level}>
                                <DataTable simple clickable data={this.state.coursesByLevel[level]} onRowClick={this.onCourseClick}/>
                            </Bootstrap.TabPane>
                        );
                    }.bind(this))}
                </Bootstrap.TabbedArea>
            </div>
        );
    }
});

module.exports = DepartmentDetailView;
