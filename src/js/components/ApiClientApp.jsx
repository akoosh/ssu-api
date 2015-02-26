/** @jsx React.DOM */

var React      = require('react');

var DataStore  = require('../stores/DataStore');
var AppActions = require('../actions/AppActions');
var ApiClient  = require('./ApiClient');

function getAppState() {
    return {
        data: DataStore.getData(),
        dataType: DataStore.getDataType()
    };
}

var ApiClientApp = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        DataStore.addChangeListener(this.onChange);

        // Not sure if this goes here. It seems like there is a better
        // way to trigger the initial data fetch.
        AppActions.getData('students');
    },

    componentWillUnmount: function() {
        DataStore.removeChangeListener(this.onChange);
    },

    onChange: function() {
        this.setState(getAppState());
    },

    render: function() {
        return (
            <ApiClient data={this.state.data} dataType={this.state.dataType} />
        );
    }
});

module.exports = ApiClientApp;
