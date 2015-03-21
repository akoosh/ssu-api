/** @jsx React.DOM */

var React        = require('react');
var Router       = require('react-router');
var Route        = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Redirect     = Router.Redirect;

// Root view
var ApiClientApp    = require('./components/ApiClientApp');

// ControllerViews
var FileUploadView  = require('./components/controllerViews/FileUploadView');
var StudentListView = require('./components/controllerViews/StudentListView');

var routes = (
    <Route path='/' handler={ApiClientApp}>
        <Route name='file-upload' path='upload' handler={FileUploadView}/>
        <Route name='students' path='/students' handler={StudentListView}/>

        <Redirect from='/' to='students'/>
    </Route>
);

module.exports = routes;
