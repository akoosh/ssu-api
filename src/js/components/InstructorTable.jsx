/** @jsx React.DOM */

var React = require('react');
var $     = require('jquery');

var InstructorTable = React.createClass({
    loadInstructors: function() {
        $.ajax({
            url: 'api/v0/instructors',
            dataType: 'json',
            success: function(instructors) {
                this.setState({instructors: instructors});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('api/v0/instructors', status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {instructors: []};
    },

    componentDidMount: function() {
        this.loadInstructors();
    },

    render: function() {

        var rows = [];

        this.state.instructors.forEach(function(instructor) {
            rows.push(
                <tr>
                    <td>{instructor.faculty_id}</td>
                    <td>{instructor.last_name}</td>
                    <td>{instructor.first_name}</td>
                </tr>
            );
        });

        return (
            <div className='instructorList'>
                <h2>Instructors</h2>
                <table>
                    <tr>
                        <th>faculty_id</th>
                        <th>last_name</th>
                        <th>first_name</th>
                    </tr>
                    {rows}
                </table>
            </div>
        );
    }
});

module.exports = InstructorTable;
