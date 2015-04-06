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
            advisor: formattedName(advisement.advisor),
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

function getViewState() {
    var data = StudentDataStore.getStudentData();
    return {
        student: data.student,
        advisors: advisorList(data.advisors),
        classHistory: classHistory(data.sections)
    };
}

var StudentDetailView = React.createClass({

    mixins: [Router.State],

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

    render: function() {
        return (
            <div className='StudentDetailView'>
                <Bootstrap.PageHeader>
                    {this.state.student.first_name} {this.state.student.last_name} <small>{this.state.student.student_id}</small>
                </Bootstrap.PageHeader>

                <h2>Advisors</h2>
                <Bootstrap.Row>
                    <Bootstrap.Col xs={6}>
                        <DataTable simple data={this.state.advisors}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>

                <Bootstrap.Row>
                    <Bootstrap.Col xs={8}>
                        <h2>Class History</h2>
                        {Object.keys(this.state.classHistory).map(function(term) {
                            return (
                                <div key={term}>
                                    <h4>{term}</h4>
                                    <DataTable simple data={this.state.classHistory[term]}/>
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
