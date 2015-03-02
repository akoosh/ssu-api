/** @jsx React.DOM */

var React = require('react');

var DataTable = React.createClass({

    render: function() {

        var rows = [];
        var keys = [];

        if (this.props.data.length > 0) {
            keys = Object.keys(this.props.data[0]);
            var tableHeadings = keys.map(function(key) {
                return <th key={key}>{key}</th>;
            });

            rows.push(
                <tr key='headings'>
                    {tableHeadings}
                </tr>
            );
        }

        this.props.data.forEach(function(datum, i) {
            var dataCells = keys.map(function(key) {
                return <td key={key}>{datum[key]}</td>;
            });

            rows.push(
                <tr key={'row_' + i}>
                    {dataCells}
                </tr>
            );
        });

        return (
            <div className='DataTable'>
                <h2>{this.props.dataType.toUpperCase()}</h2>
                <table>
                    {rows}
                </table>
            </div>
        );
    }
});

module.exports = DataTable;
