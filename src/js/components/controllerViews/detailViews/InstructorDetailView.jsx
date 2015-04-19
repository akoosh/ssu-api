// InstructorDetailView.jsx
'use strict';

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var TermHistory             = require('../../subviews/TermHistory');
var InstructorDataStore     = require('../../../stores/InstructorDataStore');

function formattedSections(sections) {
    return sections.map(function(section) {
        return {
            term: section.term,
            class_number: section.class_nbr,
            subject: section.course.subject,
            catalog: section.course.catalog,
            course_title: section.course.course_title,
            units: section.class_units === '0.00' ? '-' : section.class_units,
            section: section.section_number,
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
        var data = InstructorDataStore.getDataForInstructor(this.getParams().instructor_id);
        return {
            instructor: data.instructor,
            sections: formattedSections(data.sections)
        };
    },

    onChange: function() {
        this.setState(this.getViewState());
    },

    componentDidMount: function() {
        InstructorDataStore.addChangeListener(this.onChange);

        var instructor_id = this.getParams().instructor_id;
        if (!InstructorDataStore.hasDataForInstructor(instructor_id)) {
            AppActions.fetchDataForInstructor(instructor_id);
        }
    },

    componentWillUnmount: function() {
        InstructorDataStore.removeChangeListener(this.onChange);
    },

    onSectionRowClick: function(section) {
        this.transitionTo('section-detail', {term: section.term, class_nbr: section.class_number});
    },

    render: function() {
        return (
            <div className='InstructorDetailView'>
                <Bootstrap.PageHeader>
                    {this.state.instructor.first_name} {this.state.instructor.last_name} <small>Instructor ID: {this.state.instructor.faculty_id}</small>
                </Bootstrap.PageHeader>

                <Bootstrap.Row>
                    <Bootstrap.Col xs={8}>
                        <TermHistory label='Instruction History' data={this.state.sections} onRowClick={this.onSectionRowClick}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </div>
        );
    }
});

module.exports = InstructorDetailView;
