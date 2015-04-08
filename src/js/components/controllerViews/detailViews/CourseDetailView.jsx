/** @jsx React.DOM */

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var CourseDataStore     = require('../../../stores/CourseDataStore');

function formattedName(obj) {
    return [obj.last_name, obj.first_name].join(', ');
}

function classHistory(sections) {
    var grouped = _.groupBy(sections, 'term_description');

    var history = {};
    Object.keys(grouped).forEach(function(term) {
        history[term] = grouped[term].map(function(section) {
            return {
                class_number: section.class_nbr,
                instructor: formattedName(section.instructor),
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

function getViewState() {
    var data = CourseDataStore.getCourseData();
    return {
        course: data.course,
        classHistory: classHistory(data.sections),
        sectionLinkParams: sectionLinkParams(data.sections)
    };
}

var InstructorDetailView = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        CourseDataStore.addChangeListener(this.onChange);

        var params = this.getParams();
        AppActions.fetchDataForCourse(params.subject, params.catalog_number);
    },

    componentWillUnmount: function() {
        CourseDataStore.removeChangeListener(this.onChange);
    },

    onSectionRowClick: function(term, section) {
        this.transitionTo('section-detail', this.state.sectionLinkParams[term + section.class_number]);
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

module.exports = InstructorDetailView;
