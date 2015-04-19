// CourseDetailView.jsx
'use strict';

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var TermHistory             = require('../../subviews/TermHistory');
var CourseDataStore     = require('../../../stores/CourseDataStore');

function formattedName(obj) {
    return [obj.last_name, obj.first_name].join(', ');
}

function formattedSections(sections) {
    return sections.map(function(section) {
        return {
            term: section.term,
            class_number: section.class_nbr,
            instructor: formattedName(section.instructor),
            units: section.class_units === '0.00' ? '-' : section.class_units,
            section: section.section_nbr,
            component: section.component
        };
    });
}

var InstructorDetailView = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function() {
        return this.getViewState();
    },

    getViewState: function() {
        var params = this.getParams();
        var data = CourseDataStore.getDataForCourse(params.subject, params.catalog_number);
        return {
            course: data.course,
            sections: formattedSections(data.sections)
        };
    },

    onChange: function() {
        this.setState(this.getViewState());
    },

    componentDidMount: function() {
        CourseDataStore.addChangeListener(this.onChange);

        var params = this.getParams();
        if (!CourseDataStore.hasDataForCourse(params.subject, params.catalog_number)) {
            AppActions.fetchDataForCourse(params.subject, params.catalog_number);
        }
    },

    componentWillUnmount: function() {
        CourseDataStore.removeChangeListener(this.onChange);
    },

    onSectionRowClick: function(section) {
        this.transitionTo('section-detail', {term: section.term, class_nbr: section.class_number});
    },

    render: function() {
        return (
            <div className='InstructorDetailView'>
                <Bootstrap.PageHeader>
                    {this.state.course.subject} {this.state.course.catalog}: {this.state.course.course_title}
                </Bootstrap.PageHeader>

                <Bootstrap.Row>
                    <Bootstrap.Col xs={8}>
                    <h4>{this.state.course.course_description}</h4>

                    <TermHistory label='Class History' data={this.state.sections} onRowClick={this.onSectionRowClick}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </div>
        );
    }
});

module.exports = InstructorDetailView;
