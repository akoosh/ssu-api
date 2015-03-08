/** @jsx React.DOM */

var React = require('react');

var DataTable = require('./DataTable');

var Content = React.createClass({
    render: function() {
        return (
            <div className='Content'>
                <h1>{this.props.tableState.dataType.toUpperCase()}</h1>
                <DataTable {...this.props.tableState} />
            </div>
        );
    }
});

module.exports = Content;
