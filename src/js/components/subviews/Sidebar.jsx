// Sidebar.jsx
'use strict';

var React       = require('react');
var Router      = require('react-router');
var Bootstrap   = require('react-bootstrap');

var Sidebar = React.createClass({

    mixins: [Router.State, Router.Navigation],

    render: function() {

        var homeHref = this.makeHref('home');
        var homeIsActive = this.isActive('home');

        var fileUploadHref = this.makeHref('file-upload');
        var fileUploadIsActive = this.isActive('file-upload');

        var listGroupItems = [
            {value: 'students', label: 'Students'},
            {value: 'instructors', label: 'Instructors'},
            {value: 'advisors', label: 'Advisors'},
            {value: 'courses', label: 'Courses'},
            {value: 'departments', label: 'Departments'}
        ].map(function(item, i) {
            var href = this.makeHref(item.value);
            var isActive = this.isActive(item.value);
            return <Bootstrap.ListGroupItem key={i} href={href} active={isActive}>{item.label}</Bootstrap.ListGroupItem>;
        }.bind(this));

        return (
            <div className='Sidebar'>
                <Bootstrap.PageHeader>Full Moon</Bootstrap.PageHeader>

                <Bootstrap.ListGroup>
                    <Bootstrap.ListGroupItem href={homeHref} active={homeIsActive}>Home</Bootstrap.ListGroupItem>
                </Bootstrap.ListGroup>

                <Bootstrap.ListGroup>
                    {listGroupItems}
                </Bootstrap.ListGroup>

                <Bootstrap.ListGroup>
                    <Bootstrap.ListGroupItem href={fileUploadHref} active={fileUploadIsActive}>File Upload</Bootstrap.ListGroupItem>
                </Bootstrap.ListGroup>
            </div>
        );
    }
});

module.exports = Sidebar;
