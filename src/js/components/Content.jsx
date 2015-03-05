/** @jsx React.DOM */

var React = require('react');

var DataTable = require('./DataTable');

var Content = React.createClass({
    render: function() {
        return (
            <div className='Content'>
                <h1>{this.props.dataType.toUpperCase()}</h1>
                <DataTable data={this.props.data} dataType={this.props.dataType} />
            </div>
        );
    }
});

module.exports = Content;
