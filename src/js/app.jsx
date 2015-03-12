/** @jsx React.DOM */

var React = require('react');
var ApiClientApp = require('./components/ApiClientApp');

var Router = require('react-router');
var Route  = Router.Route;

Router.run(<Route handler={ApiClientApp}/>, Router.HistoryLocation, function(Handler) {
    React.render(<Handler/>, document.body);
});
