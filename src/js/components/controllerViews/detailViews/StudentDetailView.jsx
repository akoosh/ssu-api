// StudentDetailView.jsx
'use strict';

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var TermHistory             = require('../../subviews/TermHistory');
var StudentDataStore        = require('../../../stores/StudentDataStore');

function formattedName(obj) {
    return [obj.last_name, obj.first_name].join(', ');
}

function advisorList(advisements) {
    return advisements.map(function(advisement) {
        return {
            advisor_id: advisement.advisor.faculty_id,
            advisor_name: formattedName(advisement.advisor),
            term: advisement.term_description,
            academic_plan: advisement.acad_plan_descr
        };
    });
}

function formattedSections(sections) {
    return sections.map(function(section) {
        return {
            term: section.section.term,
            class_number: section.section.class_nbr,
            subject: section.section.course.subject,
            catalog: section.section.course.catalog,
            course_title: section.section.course.course_title,
            instructor: formattedName(section.section.instructor),
            units: section.section.class_units === '0.00' ? '-' : section.section.class_units,
            section: section.section.section_number,
            component: section.section.component,
            grade: section.grade || '-'
        };
    });
}

var StudentDetailView = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function() {
        return this.getViewState();
    },

    getViewState: function() {
        var data = StudentDataStore.getDataForStudent(this.getParams().student_id);
        return {
            student: data.student,
            advisors: advisorList(data.advisors),
            sections: formattedSections(data.sections)
        };
    },

    onChange: function() {
        this.setState(this.getViewState());
    },

    componentDidMount: function() {
        StudentDataStore.addChangeListener(this.onChange);

        var student_id = this.getParams().student_id;
        if (!StudentDataStore.hasDataForStudent(student_id)) {
            AppActions.fetchDataForStudent(this.getParams().student_id);
        }
    },

    componentWillUnmount: function() {
        StudentDataStore.removeChangeListener(this.onChange);
    },

    onAdvisorRowClick: function(advisor) {
        this.transitionTo('advisor-detail', {advisor_id: advisor.advisor_id});
    },

    onSectionRowClick: function(section) {
        this.transitionTo('section-detail', {term: section.term, class_nbr: section.class_number});
    },

    render: function() {
        return (
            <div className='StudentDetailView'>
                <Bootstrap.PageHeader>
                    {this.state.student.first_name} {this.state.student.last_name} <small>Student ID: {this.state.student.student_id}</small>
                </Bootstrap.PageHeader>

                <h2>Advisors</h2>
                <Bootstrap.Row>
                    <Bootstrap.Col xs={6}>
                        <DataTable simple data={this.state.advisors} onRowClick={this.onAdvisorRowClick}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>

                <Bootstrap.Row>
                    <Bootstrap.Col xs={8}>
                        <TermHistory label='Class History' data={this.state.sections} onRowClick={this.onSectionRowClick}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </div>
        );
    }
});

module.exports = StudentDetailView;
