/** @jsx React.DOM */

var React                   = require('react');
var Bootstrap               = require('react-bootstrap');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var InstructorListDataStore = require('../../../stores/InstructorListDataStore');

function getViewState() {
    return {
        instructors: InstructorListDataStore.getInstructors()
    };
}

var InstructorListView = React.createClass({

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        InstructorListDataStore.addChangeListener(this.onChange);
        AppActions.fetchInstructors();
    },

    componentWillUnmount: function() {
        InstructorListDataStore.removeChangeListener(this.onChange);
    },

    render: function() {
        return (
            <div className='InstructorListView'>
                <Bootstrap.PageHeader>Instructors</Bootstrap.PageHeader>
                <DataTable data={this.state.instructors}/>
            </div>
        );
    }
});

module.exports = InstructorListView;
