/** @jsx React.DOM */

var React = require('react');
var StudentTable = require('./components/StudentTable');

React.render(
    <StudentTable />,
    document.getElementById('content')
);
