/** @jsx React.DOM */

var React                   = require('react');
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

    render: function() {
        return (
            <div className='AdvisorListView'>
                <Bootstrap.PageHeader>Advisors</Bootstrap.PageHeader>
                <DataTable data={this.state.advisors}/>
            </div>
        );
    }
});

module.exports = AdvisorListView;
