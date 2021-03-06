// HomeView.jsx
'use strict';

var React      = require('react');
var Bootstrap  = require('react-bootstrap');
var Link       = require('react-router').Link;

var HomeView = React.createClass({
    render: function() {
        return (
            <div className='HomeView'>
                <Bootstrap.Jumbotron>
                    <h1>Full Moon</h1>
                    <p>Choose an entry point to get started:</p>
                    <ul>
                        <li><Link to='students'>Students</Link></li>
                        <li><Link to='instructors'>Instructors</Link></li>
                        <li><Link to='advisors'>Advisors</Link></li>
                        <li><Link to='courses'>Courses</Link></li>
                        <li><Link to='departments'>Departments</Link></li>
                    </ul>
                </Bootstrap.Jumbotron>
            </div>
        );
    }
});

module.exports = HomeView;
