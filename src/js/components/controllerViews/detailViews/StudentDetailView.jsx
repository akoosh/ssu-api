/** @jsx React.DOM */

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
        return section.class.term_description;
    });

    var history = {};
    Object.keys(grouped).forEach(function(term) {
        history[term] = grouped[term].map(function(section) {
            return {
                class_number: section.class.class_nbr,
                subject: section.class.course.subject,
                catalog: section.class.course.catalog,
                course_title: section.class.course.course_title,
                instructor: formattedName(section.class.instructor),
                units: section.class.class_units,
                section: section.class.section,
                component: section.class.component,
                grade: section.grade
            };
        });
    });

    return history;
}

function sectionLinkParams(sections) {
    var params = {};
    sections.forEach(function(section) {
        params[section.class.term_description + section.class.class_nbr] = {
            term: section.class.term,
            class_nbr: section.class.class_nbr
        };
    });

    return params;
}

function getViewState() {
    var data = StudentDataStore.getStudentData();
    return {
        student: data.student,
        advisors: advisorList(data.advisors),
        classHistory: classHistory(data.sections),
        sectionLinkParams: sectionLinkParams(data.sections)
    };
}

var StudentDetailView = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        StudentDataStore.addChangeListener(this.onChange);
        AppActions.fetchDataForStudent(this.getParams().student_id);
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
                    {this.state.student.first_name} {this.state.student.last_name} <small>{this.state.student.student_id}</small>
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

// <DataTable simple data={this.state.sections}/>

module.exports = StudentDetailView;
