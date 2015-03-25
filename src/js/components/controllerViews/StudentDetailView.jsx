/** @jsx React.DOM */

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var AppActions              = require('../../actions/AppActions');
var DataTable               = require('../subviews/DataTable/DataTable');
var StudentDataStore        = require('../../stores/StudentDataStore');

function getViewState() {
    return StudentDataStore.getStudentData();
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
                <Bootstrap.PageHeader>{this.state.student.first_name} {this.state.student.last_name}</Bootstrap.PageHeader>
                <DataTable simple data={this.state.advisors}/>
                <DataTable simple data={this.state.sections}/>
            </div>
        );
    }
});

module.exports = StudentDetailView;
