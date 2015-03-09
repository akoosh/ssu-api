/** @jsx React.DOM */

var React = require('react');
var _     = require('lodash');

var AppActions  = require('../actions/AppActions');
var Bootstrap   = require('react-bootstrap');
var OverlayTrigger = Bootstrap.OverlayTrigger;
var Popover     = Bootstrap.Popover;
var Table       = Bootstrap.Table;

var DataTable = React.createClass({

    componentWillUpdate: function() {
        // Reset the filter when props change.
        if (this.refs.reactable) {
            this.refs.reactable.filterBy('');
        }
    },

    onPerPage: function(event) {
        AppActions.updateTableData({
            perPage: parseInt(event.target.innerHTML, 10)
        });
    },

    clickHandlerForData: function(data) {
        return function(e) {
            console.log(data);
        }.bind(this);
    },

    render: function() {

        var rows = this.props.data.map(function(item, i) {
            return (
                <tr key={i}>
                    {this.props.columns.map(function(column, i) {
                        return <td key={i}>{item[column.key]}</td>;
                    }.bind(this))}
                </tr>
            );
        }.bind(this));

        return (
            <div className='DataTable'>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            {this.props.columns.map(function(column) {
                                return <th key={column.key}>{column.label}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.data.map(function(item, i) {
                            var clickHandler = this.clickHandlerForData(item);
                            return (
                                <OverlayTrigger trigger="hover" placement="bottom" overlay={<Popover title={item.first_name}><strong>Holy guacamole!</strong> Check this info.</Popover>}>
                                    <tr key={i} onClick={clickHandler}>
                                        {this.props.columns.map(function(column, i) {
                                            // return <td key={i}>{item[column.key]}</td>;
                                            return (
                                                    <td key={i}>{item[column.key]}</td>
                                            );
                                        }.bind(this))}
                                    </tr>
                                </OverlayTrigger>
                            );
                        }.bind(this))}
                    </tbody>
                </Table>
            </div>
        );
    }
});

module.exports = DataTable;
