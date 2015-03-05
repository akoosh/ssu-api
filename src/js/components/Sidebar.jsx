/** @jsx React.DOM */

var React = require('react');

var Selector  = require('./Selector');

var Sidebar = React.createClass({
    render: function() {
        return (
            <div className='Sidebar'>
                <h1>Full Moon</h1>
                <span>View Data: <Selector dataType={this.props.dataType} /></span>
            </div>
        );
    }
});

module.exports = Sidebar;
