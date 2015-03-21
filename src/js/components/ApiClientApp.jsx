/** @jsx React.DOM */

var React           = require('react');
var RouteHandler    = require('react-router').RouteHandler;
var Sidebar         = require('./subviews/Sidebar');

var ApiClientApp = React.createClass({
    render: function() {
        return (
            <div className='ApiClientApp'>
                <div className='sidebar container'>
                    <Sidebar/>
                </div>
                <div className='content container'>
                    <RouteHandler/>
                </div>
            </div>
        );
    }
});

module.exports = ApiClientApp;
