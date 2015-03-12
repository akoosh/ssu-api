/** @jsx React.DOM */

var React = require('react');
var _     = require('lodash');

var AppActions  = require('../actions/AppActions');
var Bootstrap   = require('react-bootstrap');

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

    clickHandlerForData: function(data) {
        return function(e) {
            console.log(data);
        }.bind(this);
    },

    render: function() {

        var begin = this.props.perPage * this.props.pageNum;
        var end = begin + this.props.perPage;

        end = end < this.props.searchData.length ? end : this.props.searchData.length;
        var data = this.props.searchData.slice(begin, end);
        var numPages = this.props.searchData.length / this.props.perPage;

        return (
            <div className='DataTable'>
                <Bootstrap.Row>
                    <Bootstrap.Col xs={9}>
                        <Bootstrap.Input type='text' value={this.props.searchQuery} addonBefore={<span>Search: </span>} onChange={this.onSearchQueryChange} />
                    </Bootstrap.Col>
                    <Bootstrap.Col xs={3}>
                        <Bootstrap.Input type='select' value={this.props.perPage} addonBefore={<span>Items per page: </span>} onChange={this.onPerPage}>
                            {_.range(5, 51, 5).map(function(i) {
                                return <option key={i} value={i}>{i}</option>;
                            }.bind(this))}
                        </Bootstrap.Input>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row>
                    <Bootstrap.Col xs={12}>
                        <Bootstrap.Table striped bordered condensed hover>
                            <thead>
                                <tr>
                                    {this.props.columns.map(function(column, i) {
                                        var bsStyle = '';

                                        if (column.key === this.props.sortKey) {
                                            bsStyle += ' active';

                                            switch (this.props.sortOrder) {
                                                case -1:
                                                    bsStyle += ' header-sort-desc';
                                                    break;
                                                case 1:
                                                    bsStyle += ' header-sort-asc';
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }

                                        return (
                                            <th key={i} className={bsStyle} data-key={column.key} onClick={this.onHeaderClick}>
                                                {column.label}
                                            </th>
                                        );
                                    }.bind(this))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(function(item, i) {
                                    var clickHandler = this.clickHandlerForData(item);
                                    return (
                                        <tr key={i} onClick={clickHandler}>
                                            {this.props.columns.map(function(column, i) {
                                                var bsStyle = column.key === this.props.sortKey ? 'active' : '';
                                                return <td key={i} className={bsStyle}>{item[column.key]}</td>;
                                            }.bind(this))}
                                        </tr>
                                    );
                                }.bind(this))}
                            </tbody>
                        </Bootstrap.Table>
                    </Bootstrap.Col>
                </Bootstrap.Row>
                <Bootstrap.Row>
                    <Bootstrap.Col xs={12} className='text-center'>
                        <Bootstrap.ButtonGroup>
                            {_.range(numPages).map(function(i) {
                                var bsStyle = this.props.pageNum === i ? 'primary' : 'default';
                                return <Bootstrap.Button key={i} data-pagenum={i} bsStyle={bsStyle} onClick={this.onPage}>
                                    {i + 1}
                                </Bootstrap.Button>;
                            }.bind(this))}
                        </Bootstrap.ButtonGroup>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </div>
        );
    }
});

module.exports = DataTable;
