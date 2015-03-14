/** @jsx React.DOM */

var React      = require('react');
var Bootstrap  = require('react-bootstrap');
var AppActions = require('../actions/AppActions');
var DataTable  = require('./DataTable/DataTable');

var Content = React.createClass({

    statics: {
        willTransitionTo: function(transition, params, query) {
            // console.log('willTransitionTo Content');
            AppActions.getData(params.dataType);
        }
    },

    render: function() {
        return (
            <div className='Content'>
                <Bootstrap.PageHeader>{this.props.tableState.dataType.toUpperCase()}</Bootstrap.PageHeader>
                <DataTable {...this.props.tableState} />
            </div>
        );
    }
});

module.exports = Content;
