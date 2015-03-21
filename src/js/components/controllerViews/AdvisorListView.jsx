/** @jsx React.DOM */

var React                   = require('react');
var Bootstrap               = require('react-bootstrap');
var AppActions              = require('../../actions/AppActions');
var DataTableDataStore      = require('../../stores/DataTableDataStore');
var DataTable               = require('../subviews/DataTable/DataTable');

function getViewState() {
    return {
        tableState: DataTableDataStore.getStateForKey('advisors')
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
        DataTableDataStore.addChangeListener(this.onChange);
        AppActions.advisorListViewDidMount();
    },

    componentWillUnmount: function() {
        DataTableDataStore.removeChangeListener(this.onChange);
        AppActions.advisorListViewWillUnmount();
    },

    render: function() {
        return (
            <div className='AdvisorListView'>
                <Bootstrap.PageHeader>Advisors</Bootstrap.PageHeader>
                <DataTable tableKey='advisors' {...this.state.tableState} />
            </div>
        );
    }
});

module.exports = AdvisorListView;
