// TermHistory.jsx
'use strict';

var React       = require('react');
var _           = require('lodash');
var DataTable   = require('./DataTable/DataTable');
var utils       = require('../../utils/schoolUtils');

var TermHistory = React.createClass({

    propTypes: {
        // Required: An array of objects that contain the 'term' key.
        data: React.PropTypes.array.isRequired,

        // Optional: The label to display in the header.
        label: React.PropTypes.string,

        // Optional: function(data){} where data is the data for the row that is clicked.
        onRowClick: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            history: {},
            columns: []
        };
    },

    setDerivedState: function(props) {
        var history = _.groupBy(props.data, 'term');
        var columns = props.data.length ? _.difference(Object.keys(props.data[0]), ['term']) : [];

        this.setState({
            history: history,
            columns: columns
        });
    },

    componentWillMount: function() {
        this.setDerivedState(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
        this.setDerivedState(nextProps);
    },

    clickHandlerForData: function(data) {
        return function(event) {
            this.props.onRowClick(data);
        }.bind(this);
    },

    render: function() {

        return (
            <div className='TermHistory'>
                <h2>{this.props.label}</h2>
                {Object.keys(this.state.history).sort().reverse().map(function(term) {
                    return (
                        <div key={term}>
                            <h4>{utils.termDescriptionFromCode(term)}</h4>
                            <DataTable simple data={this.state.history[term]} columns={this.state.columns} onRowClick={this.props.onRowClick}/>
                        </div>
                    );
                }.bind(this))}
            </div>
        );
    }
});

module.exports = TermHistory;
