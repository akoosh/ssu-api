/** @jsx React.DOM */

var React      = require('react');

var DataTableDataStore = require('../stores/DataTableDataStore');
var AppActions = require('../actions/AppActions');
var ApiClient  = require('./ApiClient');

function getAppState() {
    return {
        tableState: DataTableDataStore.getState(),
    };
}

var ApiClientApp = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    onChange: function() {
        this.setState(getAppState());
    },

    componentDidMount: function() {
        DataTableDataStore.addChangeListener(this.onChange);

        // Not sure if this goes here. It seems like there is a better
        // way to trigger the initial data fetch.
        AppActions.getData('students');
    },

    componentWillUnmount: function() {
        DataTableDataStore.removeChangeListener(this.onChange);
    },

    render: function() {
        return (
            <ApiClient {...this.state} />
        );
    }
});

module.exports = ApiClientApp;
