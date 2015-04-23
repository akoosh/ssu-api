// routes.jsx
'use strict';

var React        = require('react');
var Router       = require('react-router');
var Route        = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Redirect     = Router.Redirect;

// Root view
var ApiClientApp            = require('./components/ApiClientApp');

// ControllerViews
var HomeView                = require('./components/controllerViews/HomeView');
var FileUploadView          = require('./components/controllerViews/FileUploadView');
var StudentListView         = require('./components/controllerViews/listViews/StudentListView');
var InstructorListView      = require('./components/controllerViews/listViews/InstructorListView');
var AdvisorListView         = require('./components/controllerViews/listViews/AdvisorListView');
var CourseListView          = require('./components/controllerViews/listViews/CourseListView');
var DepartmentListView      = require('./components/controllerViews/listViews/DepartmentListView');
var StudentDetailView       = require('./components/controllerViews/detailViews/StudentDetailView');
var InstructorDetailView    = require('./components/controllerViews/detailViews/InstructorDetailView');
var AdvisorDetailView       = require('./components/controllerViews/detailViews/AdvisorDetailView');
var CourseDetailView        = require('./components/controllerViews/detailViews/CourseDetailView');
var DepartmentDetailView    = require('./components/controllerViews/detailViews/DepartmentDetailView');
var SectionDetailView       = require('./components/controllerViews/detailViews/SectionDetailView');

var routes = (
    <Route path='/' handler={ApiClientApp}>
        <DefaultRoute name='home' handler={HomeView}/>

        <Route name='file-upload' path='upload' handler={FileUploadView}/>

        <Route name='students' path='/students' handler={StudentListView}/>
        <Route name='student-detail' path='/students/:student_id' handler={StudentDetailView}/>

        <Route name='instructors' path='/instructors' handler={InstructorListView}/>
        <Route name='instructor-detail' path='/instructors/:instructor_id' handler={InstructorDetailView}/>

        <Route name='advisors' path='/advisors' handler={AdvisorListView}/>
        <Route name='advisor-detail' path='/advisors/:advisor_id' handler={AdvisorDetailView}/>

        <Route name='courses' path='/courses' handler={CourseListView}/>
        <Route path='/courses/:subject'>
            <Route name='course-detail' path=':catalog_number' handler={CourseDetailView}/>
        </Route>

        <Route name='departments' path='/departments' handler={DepartmentListView}/>
        <Route name='department-detail' path='/departments/:subject' handler={DepartmentDetailView}/>

        <Route path='/sections/:term'>
            <Route name='section-detail' path=':class_nbr' handler={SectionDetailView}/>
        </Route>
    </Route>
);

module.exports = routes;
