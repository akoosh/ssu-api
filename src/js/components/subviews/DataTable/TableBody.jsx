/** @jsx React.DOM */

var React = require('react');
var _     = require('lodash');

var Bootstrap   = require('react-bootstrap');

var TableBody = React.createClass({

    clickHandlerForData: function(data) {
        return function(event) {
            this.props.onRowClick(data);
        }.bind(this);
    },

    render: function() {
        var className = this.props.clickable ? 'clickable' : '';
        var rows = this.props.rows.map(function(item, i) {
            var clickHandler = this.clickHandlerForData(item);
            return (
                <tr className={className} key={i} onClick={clickHandler}>
                    {this.props.columns.map(function(column, i) {
                        var bsStyle = column.key === this.props.sortKey ? 'active' : '';
                        return <td key={i} className={bsStyle}>{item[column.key]}</td>;
                    }.bind(this))}
                </tr>
            );
        }.bind(this));

        return (
            <tbody>
                {rows}
            </tbody>
        );
    }
});

module.exports = TableBody;
