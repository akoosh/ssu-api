// InstructorDetailView.jsx
'use strict';

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var InstructorDataStore     = require('../../../stores/InstructorDataStore');

function classHistory(sections) {
    var grouped = _.groupBy(sections, 'term_description');

    var history = {};
    Object.keys(grouped).forEach(function(term) {
        history[term] = grouped[term].map(function(section) {
            return {
                class_number: section.class_nbr,
                subject: section.course.subject,
                catalog: section.course.catalog,
                course_title: section.course.course_title,
                units: section.class_units,
                section: section.section,
                component: section.component
            };
        });
    });

    return history;
}

function sectionLinkParams(sections) {
    var params = {};
    sections.forEach(function(section) {
        params[section.term_description + section.class_nbr] = {
            term: section.term,
            class_nbr: section.class_nbr
        };
    });

    return params;
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
            classHistory: classHistory(data.sections),
            sectionLinkParams: sectionLinkParams(data.sections)
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

    onSectionRowClick: function(term, section) {
        this.transitionTo('section-detail', this.state.sectionLinkParams[term + section.class_number]);
    },

    render: function() {
        return (
            <div className='InstructorDetailView'>
                <Bootstrap.PageHeader>
                    {this.state.instructor.first_name} {this.state.instructor.last_name} <small>Instructor ID: {this.state.instructor.faculty_id}</small>
                </Bootstrap.PageHeader>

                <h2>Instructor History</h2>
                <Bootstrap.Row>
                    <Bootstrap.Col xs={8}>
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

module.exports = InstructorDetailView;
