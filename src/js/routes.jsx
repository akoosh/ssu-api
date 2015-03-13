/** @jsx React.DOM */

var React        = require('react');
var Router       = require('react-router');
var Route        = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Redirect     = Router.Redirect;

// Components
var ApiClientApp = require('./components/ApiClientApp');
var ApiClient    = require('./components/ApiClient');
var Content      = require('./components/Content');

var routes = (
    <Route path='/' handler={ApiClientApp}>
        <Route handler={ApiClient}>
            <Route name='content' path=':dataType' handler={Content}/>
        </Route>
        <Redirect from='/' to='content' params={ {dataType: 'students'} }/>
    </Route>
);

module.exports = routes;
