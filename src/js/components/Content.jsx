/** @jsx React.DOM */

var React      = require('react');
var AppActions = require('../actions/AppActions');
var DataTable  = require('./DataTable');

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
                <h1>{this.props.tableState.dataType.toUpperCase()}</h1>
                <DataTable {...this.props.tableState} />
            </div>
        );
    }
});

module.exports = Content;
