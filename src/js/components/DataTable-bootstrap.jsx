/** @jsx React.DOM */

var React = require('react');
var _     = require('lodash');

var AppActions  = require('../actions/AppActions');
var Bootstrap   = require('react-bootstrap');

var DataTable = React.createClass({

    onPerPage: function(event) {
        AppActions.updateTableData({
            perPage: parseInt(event.target.innerHTML, 10)
        });
    },

    onPage: function(event) {
        AppActions.updateTableData({
            pageNum: parseInt(event.target.dataset.pagenum, 10)
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

        end = end < this.props.data.length ? end : this.props.data.length - 1;
        var data = this.props.data.slice(begin, end);
        var numPages = this.props.data.length / this.props.perPage;

        return (
            <div className='DataTable'>
                <Bootstrap.Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            {this.props.columns.map(function(column) {
                                return <th key={column.key}>{column.label}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(function(item, i) {
                            var clickHandler = this.clickHandlerForData(item);
                            return (
                                <Bootstrap.OverlayTrigger key={i} trigger="hover" placement="bottom" overlay={<Bootstrap.Popover title={item.first_name}><strong>Holy guacamole!</strong> Check this info.</Bootstrap.Popover>}>
                                    <tr onClick={clickHandler}>
                                        {this.props.columns.map(function(column, i) {
                                            // return <td key={i}>{item[column.key]}</td>;
                                            return (
                                                    <td key={i}>{item[column.key]}</td>
                                            );
                                        }.bind(this))}
                                    </tr>
                                </Bootstrap.OverlayTrigger>
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
