/** @jsx React.DOM */

var React = require('react');

var Selector = require('./Selector');
var StudentTable = require('./StudentTable');
var InstructorTable = require('./InstructorTable');

var ApiClientApp = React.createClass({

    onListChange: function(list) {
        this.setState({currentList: list});
    },

    getInitialState: function() {
        return {currentList: 'students'};
    },

    render: function() {

        var table;
        switch(this.state.currentList) {
            case 'students':
                table = <StudentTable />;
                break;
            case 'instructors':
                table = <InstructorTable />;
                break;
            default:
                break;
        }

        return (
            <div>
                <Selector listChanged={this.onListChange}/>
                {table}
            </div>
        );
    }
});

module.exports = ApiClientApp;
