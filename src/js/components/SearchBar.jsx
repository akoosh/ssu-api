/** @jsx React.DOM */

var React = require('react');
var _     = require('lodash');

var Bootstrap   = require('react-bootstrap');

var SearchBar = React.createClass({
    render: function() {
        return (
            <Bootstrap.Input type='text' value={this.props.value} onChange={this.props.onChange} addonBefore={<span>Search: </span>}/>
        );
    }
});

module.exports = SearchBar;
