/** @jsx React.DOM */

var React = require('react');
var ApiClientApp = require('./components/ApiClientApp');

var Router = require('react-router');
var routes = require('./routes');

Router.run(routes, function(Handler, state) {
    React.render(<Handler/>, document.body);
});
