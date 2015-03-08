/** @jsx React.DOM */

var React = require('react');

var Sidebar  = require('./Sidebar');
var Content = require('./Content');

var ApiClientApp = React.createClass({

    render: function() {
        return (
            <div className='ApiClientApp'>
                <Sidebar dataType={this.props.tableState.dataType} />
                <Content {...this.props} />
            </div>
        );
    }
});

module.exports = ApiClientApp;
