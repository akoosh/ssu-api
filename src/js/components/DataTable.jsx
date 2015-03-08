/** @jsx React.DOM */

var React = require('react');
var _     = require('lodash');

var AppActions  = require('../actions/AppActions');
var Reactable   = require('reactable');
var Table       = Reactable.Table;
var Tr          = Reactable.Tr;
var Td          = Reactable.Td;

var DataTable = React.createClass({

    componentWillUpdate: function() {
        // Reset the filter when props change.
        if (this.refs.reactable) {
            this.refs.reactable.filterBy('');
        }
    },

    onPerPage: function(event) {
        var pagination = this.props.pagination || {};
        pagination.perPage = parseInt(event.target.innerHTML, 10);

        AppActions.updateTableData({
            pagination: pagination
        });
    },

    clickHandlerForData: function(data) {
        return function(e) {
            console.log(data);
        }.bind(this);
    },

    render: function() {

        var perPageButtons = [5,10,15,20,25,30,35,40,45,50].map(function(num) {
            var classNames = 'per-page-button';

            if (this.props.pagination.perPage === num) {
                classNames += ' per-page-selected';
            }

            return <a className={classNames} onClick={this.onPerPage} key={num}>{num}</a>;
        }.bind(this));

        var rows = this.props.searchData.map(function(item, i) {
            return <Tr onClick={this.clickHandlerForData(item)} key={i} data={item}></Tr>;
        }.bind(this));

        return (
            <div className='DataTable'>
                <div className='per-page-control'>
                    <span>Items per page: {perPageButtons}</span>
                </div>
                <Table ref='reactable' columns={this.props.columns} itemsPerPage={this.props.pagination.perPage} sortable={true} filterable={_.pluck(this.props.columns, 'key')}>
                    {rows}
                </Table>
            </div>
        );
    }
});

module.exports = DataTable;
