/** @jsx React.DOM */

var React      = require('react');
var AppActions = require('../actions/AppActions');

var Selector = React.createClass({

    handleChange: function(event) {
        AppActions.getData(event.target.value);
    },

    render: function() {
        return (
            <select value={this.props.dataType} onChange={this.handleChange}>
                <option value='students'>Students</option>
                <option value='instructors'>Instructors</option>
            </select>
        );
    }
});

module.exports = Selector;
