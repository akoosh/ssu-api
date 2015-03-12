/** @jsx React.DOM */

var React = require('react');

var DataTable = require('./DataTable');

var Content = React.createClass({
    render: function() {

        function click(e) {
            console.log(e);
        }

        return (
            <div className='Content container'>
                <h1>{this.props.tableState.dataType.toUpperCase()}</h1>
                <DataTable {...this.props.tableState} />
            </div>
        );
    }
});

module.exports = Content;
