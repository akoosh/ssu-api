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
                <Bootstrap.Input
                    type='text'
                    value={this.props.searchQuery}
                    placeholder='Search'
                    onChange={this.onSearchQueryChange} />
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
                <Bootstrap.ButtonGroup>
                    {_.range(numPages).map(function(i) {
                        var bsStyle = this.props.pageNum === i ? 'primary' : 'default';
                        return <Bootstrap.Button key={i} data-pagenum={i} bsStyle={bsStyle} onClick={this.onPage}>
                            {i + 1}
                        </Bootstrap.Button>;
                    }.bind(this))}
                </Bootstrap.ButtonGroup>
            </div>
        );
    }
});

module.exports = DataTable;
