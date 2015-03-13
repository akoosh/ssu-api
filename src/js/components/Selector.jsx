/** @jsx React.DOM */

var React      = require('react');
var AppActions = require('../actions/AppActions');
var Bootstrap  = require('react-bootstrap');
var Navigation = require('react-router').Navigation;

var Selector = React.createClass({

    mixins: [Navigation],

    handleChange: function(event) {
        this.transitionTo('content', {dataType: event.target.value});
    },

    render: function() {
        return (
            <Bootstrap.Input type='select' value={this.props.dataType} label='View Data' onChange={this.handleChange}>
                <option value='students'>Students</option>
                <option value='instructors'>Instructors</option>
                <option value='advisors'>Advisors</option>
                <option value='courses'>Courses</option>
            </Bootstrap.Input>
        );
    }
});

module.exports = Selector;
