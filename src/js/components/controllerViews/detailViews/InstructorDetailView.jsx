/** @jsx React.DOM */

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

function getViewState() {
    var data = InstructorDataStore.getInstructorData();
    return {
        instructor: data.instructor,
        classHistory: classHistory(data.sections)
    };
}

var InstructorDetailView = React.createClass({

    mixins: [Router.State],

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        InstructorDataStore.addChangeListener(this.onChange);
        AppActions.fetchDataForInstructor(this.getParams().instructor_id);
    },

    componentWillUnmount: function() {
        InstructorDataStore.removeChangeListener(this.onChange);
    },

    render: function() {
        return (
            <div className='InstructorDetailView'>
                <Bootstrap.PageHeader>
                    {this.state.instructor.first_name} {this.state.instructor.last_name} <small>{this.state.instructor.faculty_id}</small>
                </Bootstrap.PageHeader>

                <h2>Class History</h2>
                <Bootstrap.Row>
                    <Bootstrap.Col xs={8}>
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

module.exports = InstructorDetailView;
