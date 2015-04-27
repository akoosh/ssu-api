// DepartmentListView.jsx
'use strict';

var React           = require('react');
var Router          = require('react-router');
var Bootstrap       = require('react-bootstrap');
var _               = require('lodash');
var AppActions      = require('../../../actions/AppActions');
var CourseDataStore = require('../../../stores/CourseDataStore');

function alphabetizedSubjects(subjects) {
    return _.groupBy(subjects, '0');
}

var DepartmentListView = React.createClass({

    mixins: [Router.state, Router.Navigation],

    getInitialState: function() {
        return this.getViewState();
    },

    onChange: function() {
        this.setState(this.getViewState());
    },

    getViewState: function() {
        var subjects = CourseDataStore.getAllSubjects();
        return {
            alphabetizedSubjects: alphabetizedSubjects(subjects),
            subjectHrefs: this.subjectHrefs(subjects)
        };
    },

    subjectHrefs: function(subjects) {
        var hrefs = {};
        subjects.forEach(function(subject) {
            hrefs[subject] = this.makeHref('department-detail', {subject: subject});
        }.bind(this));

        return hrefs;
    },

    componentDidMount: function() {
        CourseDataStore.addChangeListener(this.onChange);
        AppActions.fetchCourses();
    },

    componentWillUnmount: function() {
        CourseDataStore.removeChangeListener(this.onChange);
    },

    render: function() {
        return (
            <div className='DepartmentListView'>
                <Bootstrap.PageHeader>Departments</Bootstrap.PageHeader>

                    <Bootstrap.TabbedArea defaultActiveKey={0}>
                        {Object.keys(this.state.alphabetizedSubjects).map(function(letter, i) {
                            return (
                                <Bootstrap.TabPane key={i} eventKey={i} tab={letter}>
                                    <Bootstrap.ListGroup>
                                        {this.state.alphabetizedSubjects[letter].map(function(subject, i) {
                                            return <Bootstrap.ListGroupItem key={i} href={this.state.subjectHrefs[subject]}>{subject}</Bootstrap.ListGroupItem>;
                                        }.bind(this))}
                                    </Bootstrap.ListGroup>
                                </Bootstrap.TabPane>
                            );
                        }.bind(this))}
                    </Bootstrap.TabbedArea>
            </div>
        );
    }
});

module.exports = DepartmentListView;
