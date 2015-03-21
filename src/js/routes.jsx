/** @jsx React.DOM */

var React        = require('react');
var Router       = require('react-router');
var Route        = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Redirect     = Router.Redirect;

// Root view
var ApiClientApp        = require('./components/ApiClientApp');

// ControllerViews
var HomeView            = require('./components/controllerViews/HomeView');
var FileUploadView      = require('./components/controllerViews/FileUploadView');
var StudentListView     = require('./components/controllerViews/StudentListView');
var InstructorListView  = require('./components/controllerViews/InstructorListView');
var AdvisorListView     = require('./components/controllerViews/AdvisorListView');
var CourseListView      = require('./components/controllerViews/CourseListView');

var routes = (
    <Route path='/' handler={ApiClientApp}>
        <DefaultRoute name='home' handler={HomeView}/>

        <Route name='file-upload' path='upload' handler={FileUploadView}/>

        <Route name='students' path='/students' handler={StudentListView}/>
        <Route name='instructors' path='/instructors' handler={InstructorListView}/>
        <Route name='advisors' path='/advisors' handler={AdvisorListView}/>
        <Route name='courses' path='/courses' handler={CourseListView}/>
    </Route>
);

module.exports = routes;
