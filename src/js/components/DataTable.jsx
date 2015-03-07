/** @jsx React.DOM */

var React = require('react');

var Reactabular = require('reactabular');
var Paginator   = require('react-pagify');
var Table       = Reactabular.Table;
var Search      = Reactabular.Search;
var sortColumn  = Reactabular.sortColumn;

function nameFromKey(key) {
    return key.replace(/_/g, ' ');
}

var DataTable = React.createClass({

    getColumns: function(data) {
        var columns = [];
        if (data.length > 0) {
            var keys = Object.keys(data[0]);
            columns = keys.map(function(key) {
                return {
                    property: key,
                    header: nameFromKey(key)
                };
            });
        }

        return columns;
    },

    getInitialState: function() {
        return {
            data: this.props.data,
            columns: this.getColumns(this.props.data),
            searchData: this.props.data,
            pagination: {
                page: 0,
                perPage: 10
            }
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            data: nextProps.data,
            columns: this.getColumns(nextProps.data),
            searchData: nextProps.data
        });
    },

    onSelect: function(page) {
        var pagination = this.state.pagination || {};
        pagination.page = page;

        this.setState({
            pagination: pagination
        });
    },

    onPerPage: function(event) {
        var pagination = this.state.pagination || {};
        pagination.perPage = parseInt(event.target.value, 10);

        this.setState({
            pagination: pagination
        });
    },

    render: function() {

        var header = {
            onClick: function(column) {
                sortColumn(
                    this.state.columns,
                    column,
                    this.state.searchData,
                    this.setState.bind(this)
                );
            }.bind(this)
        };

        var paginated = Paginator.paginate(this.state.searchData, this.state.pagination);

        return (
            <div className='DataTable'>
                <div className='table-controls'>
                    <span> Per page: </span>
                    <input type='text' defaultValue={this.state.pagination.perPage} onChange={this.onPerPage}></input>
                    <span> Search: </span>
                    <Search columns={this.state.columns} data={this.state.data} onResult={this.setState.bind(this)} />
                </div>
                <Table columns={this.state.columns} data={paginated.data} header={header} />
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
