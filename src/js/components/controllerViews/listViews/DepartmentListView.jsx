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

function getViewState() {
    return {
        alphabetizedSubjects: alphabetizedSubjects(CourseDataStore.getAllSubjects())
    };
}

var DepartmentListView = React.createClass({

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
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

                <Bootstrap.Col xs={8}>
                    <Bootstrap.TabbedArea defaultActiveKey={0}>
                        {Object.keys(this.state.alphabetizedSubjects).map(function(letter, i) {
                            return (
                                <Bootstrap.TabPane key={i} eventKey={i} tab={letter}>
                                    <Bootstrap.ListGroup>
                                        {this.state.alphabetizedSubjects[letter].map(function(subject, i) {
                                            return <Bootstrap.ListGroupItem key={i}>{subject}</Bootstrap.ListGroupItem>;
                                        }.bind(this))}
                                    </Bootstrap.ListGroup>
                                </Bootstrap.TabPane>
                            );
                        }.bind(this))}
                    </Bootstrap.TabbedArea>
                </Bootstrap.Col>
            </div>
        );
    }
});

module.exports = DepartmentListView;
