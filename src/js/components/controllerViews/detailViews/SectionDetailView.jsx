/** @jsx React.DOM */

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var SectionDataStore        = require('../../../stores/SectionDataStore');

function formattedName(obj) {
    if (obj) {
        return [obj.last_name, obj.first_name].join(', ');
    } else {
        return '';
    }
}

function formattedStudents(students) {
    return students.map(function(student) {
        return {
            student_id: student.student.student_id,
            first_name: student.student.first_name,
            last_name: student.student.last_name,
            reason: student.reason,
            grade: student.grade
        };
    });
}

function getViewState() {
    var data = SectionDataStore.getSectionData();
    return {
        section: data.section,
        students: formattedStudents(data.students)
    };
}

var InstructorDetailView = React.createClass({

    mixins: [Router.State],

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        SectionDataStore.addChangeListener(this.onChange);

        var params = this.getParams();
        AppActions.fetchDataForSection(params.term, params.class_nbr);
    },

    componentWillUnmount: function() {
        SectionDataStore.removeChangeListener(this.onChange);
    },

    render: function() {
        return (
            <div className='InstructorDetailView'>
                <Bootstrap.PageHeader>
                    {(this.state.section.course || {}).subject} {(this.state.section.course || {}).catalog} <small>Class Number: {this.state.section.class_nbr}, {this.state.section.term_description}</small>
                </Bootstrap.PageHeader>

                <h2>Course Title</h2>
                <h4>{(this.state.section.course || {}).course_title}</h4>

                <h2>Instructor</h2>
                <h4>{formattedName(this.state.section.instructor)}</h4>

                <h2>Students</h2>
                <Bootstrap.Row>
                    <Bootstrap.Col xs={6}>
                        <DataTable simple data={this.state.students}/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </div>
        );
    }
});

module.exports = InstructorDetailView;
