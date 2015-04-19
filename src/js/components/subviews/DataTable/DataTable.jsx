// DataTable.jsx
'use strict';

var React           = require('react');
var Bootstrap       = require('react-bootstrap');
var _               = require('lodash');
var SearchBar       = require('./SearchBar');
var PerPageDropdown = require('./PerPageDropdown');
var TableHeader     = require('./TableHeader');
var TableBody       = require('./TableBody');
var PageNumberBar   = require('./PageNumberBar');

function nameFromKey(key) {
    // This function turns something like 'first_name' into something like 'First Name'
    return key.replace(/_/g, ' ').replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
}

function searchDataForQuery(query, data) {
    // Create a regex for each word in the query
    var patterns = query.trim().split(' ').map(function(param) {
        return new RegExp(param, 'i');
    });

    // Keep items that have at least one match for each regex
    var searchData = data.filter(function(datum) {
        return _.every(patterns, function(pattern) {
            return _.some(datum, function(prop) {
                return (prop || '').match(pattern);
            });
        });
    });

    return searchData;
}

var DataTable = React.createClass({

    propTypes: {
        // Required: Array of objects to put in table form
        data: React.PropTypes.array.isRequired,

        // Optional: array that contains a subset of the keys of the objects
        // in 'data'. If it is present, only these columns will be shown.
        columns: React.PropTypes.array,

        // Optional: function(data){} where data is the data for the row that is clicked.
        onRowClick: React.PropTypes.func,

        // Optional: if true, no search bar or pagification are displayed.
        simple: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            columns: [],
            sortData: [],
            searchData: [],
            searchQuery: '',
            pageNum: 0,
            numPages: 0,
            perPage: 15,
            sortKey: null, 
            sortOrder: 0
        };
    },

    setDerivedState: function(props) {
        // columns are derived from data
        var columns = [];

        if (props.columns || props.data.length > 0) {
            var keys = props.columns || Object.keys(props.data[0]);
            columns = keys.map(function(key) {
                return {
                    key: key,
                    label: nameFromKey(key)
                };
            });
        }

        this.setState({
            columns: columns,
            sortKey: null,
            sortOrder: 0,
            searchQuery: '',
            numPages: props.data.length / this.state.perPage,
            sortData: props.data,
            searchData: props.data
        });
    },

    sortedData: function(sortKey, sortOrder) {
        var data = this.props.data.slice();
        if (sortKey) {
            data.sort(function(a,b) {
                return a[sortKey].localeCompare(b[sortKey]) * sortOrder;
            });
        }
        return data;
    },

    pagifiedData: function() {
        if (!this.props.simple) {
            var begin = this.state.perPage * this.state.pageNum;
            var end = begin + this.state.perPage;

            end = end < this.state.searchData.length ? end : this.state.searchData.length;

            // state.numPages = state.searchData.length / state.perPage;
            return this.state.searchData.slice(begin, end);
        } else {
            return this.state.searchData;
        }
    },

    componentWillMount: function() {
        this.setDerivedState(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
        this.setDerivedState(nextProps);
    },

    onHeaderClick: function(event) {
        if (!this.props.simple) {
            var sortKey = event.target.dataset.key;
            var sortOrder = 0;
            if (sortKey === this.state.sortKey) {
                switch (this.state.sortOrder) {
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

            var sortData = this.sortedData(sortKey, sortOrder);
            var searchData = searchDataForQuery(this.state.searchQuery, sortData);

            this.setState({
                sortKey: sortKey,
                sortOrder: sortOrder,
                sortData: sortData,
                searchData: searchData
            });
        }
    },

    onPerPage: function(event) {
        var perPage = parseInt(event.target.value, 10);
        this.setState({
            perPage: perPage,
            numPages: this.state.searchData.length / perPage
        });
    },

    onPage: function(event) {
        this.setState({
            pageNum: parseInt(event.target.dataset.pagenum, 10)
        });
    },

    onSearchQueryChange: function(event) {
        var searchQuery = event.target.value;
        var searchData = searchDataForQuery(searchQuery, this.state.sortData);

        this.setState({
            pageNum: 0,
            searchQuery: event.target.value,
            searchData: searchData,
            numPages: searchData.length / this.state.perPage
        });
    },

    onRowClick: function(data) {
        if (this.props.onRowClick) {
            this.props.onRowClick(data);
        }
    },

    render: function() {
        var topBar = this.props.simple ? null : (
            <Bootstrap.Row>
                <Bootstrap.Col xs={9}>
                    <SearchBar value={this.state.searchQuery} onChange={this.onSearchQueryChange}/>
                </Bootstrap.Col>
                <Bootstrap.Col xs={3}>
                    <PerPageDropdown value={this.state.perPage} onChange={this.onPerPage}/>
                </Bootstrap.Col>
            </Bootstrap.Row>
        );

        var bottomBar = this.props.simple ? null : (
            <PageNumberBar numPages={this.state.numPages} pageNum={this.state.pageNum} onPage={this.onPage}/>
        );

        return (
            <div className='DataTable'>
                {topBar}
                <Bootstrap.Row>
                    <Bootstrap.Col xs={12}>
                        <Bootstrap.Table striped bordered condensed hover>
                            <TableHeader simple={this.props.simple} columns={this.state.columns} sortKey={this.state.sortKey} sortOrder={this.state.sortOrder} onHeaderClick={this.onHeaderClick}/>
                            <TableBody clickable={Boolean(this.props.onRowClick)} rows={this.pagifiedData()} columns={this.state.columns} sortKey={this.state.sortKey} onRowClick={this.onRowClick}/>
                        </Bootstrap.Table>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                {bottomBar}
            </div>
        );
    }
});

module.exports = DataTable;
