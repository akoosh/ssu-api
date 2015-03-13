/** @jsx React.DOM */

var React      = require('react');

var DataTableDataStore = require('../stores/DataTableDataStore');
var ApiClient  = require('./ApiClient');
var RouteHandler = require('react-router').RouteHandler;

function getAppState() {
    return {
        tableState: DataTableDataStore.getState(),
    };
}

var ApiClientApp = React.createClass({

    statics: {
        willTransitionTo: function(transition, params, query) {
            // console.log('willTransitionTo ApiClientApp');
        }
    },

    getInitialState: function() {
        return getAppState();
    },

    onChange: function() {
        this.setState(getAppState());
    },

    componentDidMount: function() {
        DataTableDataStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        DataTableDataStore.removeChangeListener(this.onChange);
    },

    render: function() {
        return (
            <RouteHandler {...this.state}/>
        );
    }
});

module.exports = ApiClientApp;
