/** @jsx React.DOM */

var React = require('react');
var _     = require('lodash');

var Bootstrap   = require('react-bootstrap');

var PerPageDropdown = React.createClass({
    render: function() {
        return (
            <Bootstrap.Input type='select' value={this.props.value} onChange={this.props.onChange} addonBefore={<span>Items per page: </span>}>
                {_.range(5, 101, 5).map(function(i) {
                    return <option key={i} value={i}>{i}</option>;
                }.bind(this))}
            </Bootstrap.Input>
        );
    }
});

module.exports = PerPageDropdown;
