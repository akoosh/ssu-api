/** @jsx React.DOM */

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var AdvisorListDataStore    = require('../../../stores/AdvisorListDataStore');

function getViewState() {
    return {
        advisors: AdvisorListDataStore.getAdvisors()
    };
}

var AdvisorListView = React.createClass({

    mixins: [Router.Navigation],

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        AdvisorListDataStore.addChangeListener(this.onChange);
        AppActions.fetchAdvisors();
    },

    componentWillUnmount: function() {
        AdvisorListDataStore.removeChangeListener(this.onChange);
    },

    onRowClick: function(advisor) {
        this.transitionTo('advisor-detail', {advisor_id: advisor.faculty_id});
    },

    render: function() {
        return (
            <div className='AdvisorListView'>
                <Bootstrap.PageHeader>Advisors</Bootstrap.PageHeader>
                <DataTable clickable data={this.state.advisors} onRowClick={this.onRowClick}/>
            </div>
        );
    }
});

module.exports = AdvisorListView;