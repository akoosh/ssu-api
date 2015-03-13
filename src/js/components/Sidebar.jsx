/** @jsx React.DOM */

var React = require('react');

var Selector  = require('./Selector');

var Sidebar = React.createClass({
    render: function() {
        return (
            <div className='Sidebar'>
                <h1>Full Moon</h1>
                <Selector dataType={this.props.dataType} />
            </div>
        );
    }
});

module.exports = Sidebar;
