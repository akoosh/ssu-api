/** @jsx React.DOM */

var React = require('react');

var AppActions  = require('../actions/AppActions');
var Reactabular = require('reactabular');
var Paginator   = require('react-pagify');
var Table       = Reactabular.Table;
var Search      = Reactabular.Search;
var sortColumn  = Reactabular.sortColumn;

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

    render: function() {

        var header = { onClick: this.onHeaderClick };
        var paginated = Paginator.paginate(this.props.searchData, this.props.pagination);

        return (
            <div className='DataTable'>
                <div className='table-controls'>
                    <span> Per page: </span>
                    <input type='text' defaultValue={this.props.pagination.perPage} onChange={this.onPerPage}></input>
                    <span> Search: </span>
                    <Search columns={this.props.columns} data={this.props.data} onResult={AppActions.updateTableData} />
                </div>

                <Table columns={this.props.columns} data={paginated.data} header={header} />

                <div className='pagination'>
                    <span>Page: </span>
                    <Paginator
                        page={paginated.page}
                        pages={paginated.amount}
                        beginPages='3'
                        endPages='3'
                        onSelect={this.onSelect}
                    />
                </div>
            </div>
        );
    }
});

module.exports = DataTable;
