/** @jsx React.DOM */

var React           = require('react');
var _               = require('lodash');
var Bootstrap       = require('react-bootstrap');
var AppActions      = require('../../actions/AppActions');
var SearchBar       = require('./SearchBar');
var PerPageDropdown = require('./PerPageDropdown');
var TableHeader     = require('./TableHeader');
var TableBody       = require('./TableBody');
var PageNumberBar   = require('./PageNumberBar');

var DataTable = React.createClass({

    onHeaderClick: function(event) {
        var sortKey = event.target.dataset.key;
        var sortOrder = 0;
        if (sortKey === this.props.sortKey) {
            switch (this.props.sortOrder) {
                case -1:
                    sortOrder = 1;
                    break;
                case 0:
                    sortOrder = 1;
                    break;
                case 1:
                    sortOrder = -1;
                    break;
                default:
                    break;
            }
        } else {
            sortOrder = 1;
        }

        AppActions.sortTableData({
            sortKey: sortKey,
            sortOrder: sortOrder
        });
    },

    onPerPage: function(event) {
        AppActions.updateTableData({
            perPage: parseInt(event.target.value, 10)
        });
    },

    onPage: function(event) {
        AppActions.updateTableData({
            pageNum: parseInt(event.target.dataset.pagenum, 10)
        });
    },

    onSearchQueryChange: function(event) {
        AppActions.searchTableData({
            searchQuery: event.target.value
        });
    },

    onRowClick: function(data) {
        console.log(data);
    },

    render: function() {
        return (
            <div className='DataTable'>
                <Bootstrap.Row>
                    <Bootstrap.Col xs={9}>
                        <SearchBar value={this.props.searchQuery} onChange={this.onSearchQueryChange}/>
                    </Bootstrap.Col>
                    <Bootstrap.Col xs={3}>
                        <PerPageDropdown value={this.props.perPage} onChange={this.onPerPage}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row>
                    <Bootstrap.Col xs={12}>
                        <Bootstrap.Table striped bordered condensed hover>
                            <TableHeader columns={this.props.columns} sortKey={this.props.sortKey} sortOrder={this.props.sortOrder} onHeaderClick={this.onHeaderClick}/>
                            <TableBody rows={this.props.pageData} columns={this.props.columns} sortKey={this.props.sortKey} onRowClick={this.onRowClick}/>
                        </Bootstrap.Table>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <PageNumberBar numPages={this.props.numPages} pageNum={this.props.pageNum} onPage={this.onPage}/>
            </div>
        );
    }
});

module.exports = DataTable;
