/** @jsx React.DOM */

var React = require('react');
var $     = require('jquery');

var StudentTable = React.createClass({
    loadStudents: function() {
        $.ajax({
            url: 'api/v0/students',
            dataType: 'json',
            success: function(students) {
                this.setState({students: students});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('api/v0/students', status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {students: []};
    },

    componentDidMount: function() {
        this.loadStudents();
    },

    render: function() {

        var rows = [];

        this.state.students.forEach(function(student) {
            rows.push(
                <tr>
                    <td>{student.student_id}</td>
                    <td>{student.last_name}</td>
                    <td>{student.first_name}</td>
                    <td>{student.gender}</td>
                    <td>{student.ethnic_grp}</td>
                </tr>
            );
        });

        return (
            <div className='studentList'>
                <h2>Students</h2>
                <table>
                    <tr>
                        <th>student_id</th>
                        <th>last_name</th>
                        <th>first_name</th>
                        <th>gender</th>
                        <th>ethnic_grp</th>
                    </tr>
                    {rows}
                </table>
            </div>
        );
    }
});

module.exports = StudentTable;
