/** @jsx React.DOM */

var React = require('react');

var Reactabular = require('reactabular');
var Table       = Reactabular.Table;
var Search      = Reactabular.Search;

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
            searchData: this.props.data
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({
            data: nextProps.data,
            columns: this.getColumns(nextProps.data),
            searchData: nextProps.data
        });
    },

    render: function() {

        var header = {
            onClick: function(column) {
                console.log(column);
            }
        };

        return (
            <div className='DataTable'>
                <div className='SearchBar'>
                    <span>Search: </span>
                    <Search columns={this.state.columns} data={this.state.data} onResult={this.setState.bind(this)} />
                </div>
                <Table columns={this.state.columns} data={this.state.searchData} header={header} />
                <span>{this.state.searchData.length} rows.</span>
            </div>
        );
    }
});

module.exports = DataTable;
