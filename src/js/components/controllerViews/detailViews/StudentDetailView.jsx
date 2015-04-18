// StudentDetailView.jsx
'use strict';

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
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

function classHistory(sections) {
    var grouped = _.groupBy(sections, function(section) {
        return section.section.term_description;
    });

    var history = {};
    Object.keys(grouped).forEach(function(term) {
        history[term] = grouped[term].map(function(section) {
            return {
                class_number: section.section.class_nbr,
                subject: section.section.course.subject,
                catalog: section.section.course.catalog,
                course_title: section.section.course.course_title,
                instructor: formattedName(section.section.instructor),
                units: section.section.class_units,
                section: section.section.section,
                component: section.section.component,
                grade: section.grade
            };
        });
    });

    return history;
}

function sectionLinkParams(sections) {
    var params = {};
    sections.forEach(function(section) {
        params[section.section.term_description + section.section.class_nbr] = {
            term: section.section.term,
            class_nbr: section.section.class_nbr
        };
    });

    return params;
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
            classHistory: classHistory(data.sections),
            sectionLinkParams: sectionLinkParams(data.sections)
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

    onSectionRowClick: function(term, section) {
        this.transitionTo('section-detail', this.state.sectionLinkParams[term + section.class_number]);
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
                        <DataTable simple clickable data={this.state.advisors} onRowClick={this.onAdvisorRowClick}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>

                <Bootstrap.Row>
                    <Bootstrap.Col xs={8}>
                        <h2>Class History</h2>
                        {Object.keys(this.state.classHistory).map(function(term) {
                            return (
                                <div key={term}>
                                    <h4>{term}</h4>
                                    <DataTable simple clickable data={this.state.classHistory[term]} onRowClick={this.onSectionRowClick.bind(this, term)}/>
                                </div>
                            );
                        }.bind(this))}
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </div>
        );
    }
});

module.exports = StudentDetailView;
