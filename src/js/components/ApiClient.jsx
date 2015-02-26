/** @jsx React.DOM */

var React = require('react');

var Selector  = require('./Selector');
var DataTable = require('./DataTable');

var ApiClientApp = React.createClass({

    render: function() {
        return (
            <div>
                <Selector dataType={this.props.dataType} />
                <DataTable data={this.props.data} dataType={this.props.dataType} />
            </div>
        );
    }
});

module.exports = ApiClientApp;
