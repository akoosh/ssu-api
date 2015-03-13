/** @jsx React.DOM */

var React = require('react');

var Sidebar  = require('./Sidebar');
var Content = require('./Content');
var RouteHandler = require('react-router').RouteHandler;

var ApiClientApp = React.createClass({

    statics: {
        willTransitionTo: function(transition, params, query) {
            // console.log('willTransitionTo ApiClient');
        }
    },

    render: function() {
        return (
            <div className='ApiClientApp'>
                <div className='sidebar container'>
                    <Sidebar dataType={this.props.tableState.dataType} />
                </div>
                <div className='content container'>
                    <RouteHandler {...this.props}/>
                </div>
            </div>
        );
    }
});

module.exports = ApiClientApp;
