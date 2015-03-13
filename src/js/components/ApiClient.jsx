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
                <Sidebar dataType={this.props.tableState.dataType} />
                <RouteHandler {...this.props}/>
            </div>
        );
    }
});

module.exports = ApiClientApp;
