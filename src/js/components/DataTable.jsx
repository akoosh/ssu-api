/** @jsx React.DOM */

var React = require('react');

var DataTable = React.createClass({

    render: function() {

        var rows = [];
        var keys = [];

        if (this.props.data.length > 0) {
            keys = Object.keys(this.props.data[0]);
            var tableHeadings = keys.map(function(key) {
                return <th>{key}</th>;
            });

            rows.push(
                <tr>
                    {tableHeadings}
                </tr>
            );
        }

        this.props.data.forEach(function(datum) {
            var dataCells = keys.map(function(key) {
                return <td>{datum[key]}</td>;
            });

            rows.push(
                <tr>
                    {dataCells}
                </tr>
            );
        });

        return (
            <div className='dataList'>
                <h2>{this.props.dataType.toUpperCase()}</h2>
                <table>
                    {rows}
                </table>
            </div>
        );
    }
});

module.exports = DataTable;
