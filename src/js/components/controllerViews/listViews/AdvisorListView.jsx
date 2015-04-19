// AdvisorListView.jsx
'use strict';

var React               = require('react');
var Router              = require('react-router');
var Bootstrap           = require('react-bootstrap');
var AppActions          = require('../../../actions/AppActions');
var DataTable           = require('../../subviews/DataTable/DataTable');
var AdvisorDataStore    = require('../../../stores/AdvisorDataStore');

function getViewState() {
    return {
        advisors: AdvisorDataStore.getAllAdvisors()
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
        AdvisorDataStore.addChangeListener(this.onChange);
        AppActions.fetchAdvisors();
    },

    componentWillUnmount: function() {
        AdvisorDataStore.removeChangeListener(this.onChange);
    },

    onRowClick: function(advisor) {
        this.transitionTo('advisor-detail', {advisor_id: advisor.faculty_id});
    },

    render: function() {
        return (
            <div className='AdvisorListView'>
                <Bootstrap.PageHeader>Advisors</Bootstrap.PageHeader>
                <DataTable data={this.state.advisors} onRowClick={this.onRowClick}/>
            </div>
        );
    }
});

module.exports = AdvisorListView;
