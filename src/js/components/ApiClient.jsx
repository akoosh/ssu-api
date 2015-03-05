/** @jsx React.DOM */

var React = require('react');

var Sidebar  = require('./Sidebar');
var Content = require('./Content');

var ApiClientApp = React.createClass({

    render: function() {
        return (
            <div className='ApiClientApp'>
                <Sidebar dataType={this.props.dataType} />
                <Content data={this.props.data} dataType={this.props.dataType} />
            </div>
        );
    }
});

module.exports = ApiClientApp;
