/** @jsx React.DOM */

var React = require('react');
var _     = require('lodash');

var AppActions  = require('../actions/AppActions');
var Reactable   = require('reactable');
var Table       = Reactable.Table;
var Tr          = Reactable.Tr;
var Td          = Reactable.Td;

var DataTable = React.createClass({

    onSelect: function(page) {
        var pagination = this.props.pagination || {};
        pagination.page = page;

        AppActions.updateTableData({
            pagination: pagination
        });
    },

    onPerPage: function(event) {
        var pagination = this.props.pagination || {};
        pagination.perPage = parseInt(event.target.value, 10);

        AppActions.updateTableData({
            pagination: pagination
        });
    },

    onSortFinished: function(sorted) {
        AppActions.updateTableData({
            sortData: sorted.data,
            columns: sorted.columns
        });
    },

    onHeaderClick: function(column) {
        sortColumn(this.props.columns, column, this.props.searchData, this.onSortFinished);
    },

    clickHandlerForData: function(data) {
        return function(e) {
            console.log(data);
        }.bind(this);
    },

    render: function() {

        var rows = this.props.searchData.map(function(item, i) {
            return <Tr onClick={this.clickHandlerForData(item)} key={i} data={item}></Tr>;
        }.bind(this));

        return (
            <div className='DataTable'>
                <Table columns={this.props.columns} itemsPerPage={15} sortable={true} filterable={_.pluck(this.props.columns, 'key')}>
                    {rows}
                </Table>
            </div>
        );
    }
});

module.exports = DataTable;
