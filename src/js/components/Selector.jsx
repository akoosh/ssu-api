/** @jsx React.DOM */

var React = require('react');

var Selector = React.createClass({

    handleChange: function(event) {
        this.props.listChanged(event.target.value);
    },

    render: function() {
        return (
            <select onChange={this.handleChange}>
                <option value='students'>Students</option>
                <option value='instructors'>Instructors</option>
            </select>
        );
    }
});

module.exports = Selector;
