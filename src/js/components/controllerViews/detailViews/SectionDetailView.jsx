// SectionDetailView.jsx
'use strict';

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var BarChart                = require('react-d3/barchart').BarChart;
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var GradeDistribution       = require('../../subviews/GradeDistribution');
var SectionDataStore        = require('../../../stores/SectionDataStore');
var utils                   = require('../../../utils/schoolUtils');

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

var InstructorDetailView = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function() {
        return this.getViewState();
    },

    getViewState: function() {
        var params = this.getParams();
        var data = SectionDataStore.getDataForSection(params.term, params.class_nbr);
        return {
            section: data.section,
            students: formattedStudents(data.students),
        };
    },

    onChange: function() {
        this.setState(this.getViewState());
    },

    componentDidMount: function() {
        SectionDataStore.addChangeListener(this.onChange);

        var params = this.getParams();
        if (!SectionDataStore.hasDataForSection(params.term, params.class_nbr)) {
            AppActions.fetchDataForSection(params.term, params.class_nbr);
        }
    },

    componentWillUnmount: function() {
        SectionDataStore.removeChangeListener(this.onChange);
    },

    onStudentRowClick: function(student) {
        this.transitionTo('student-detail', {student_id: student.student_id});
    },

    render: function() {
        return (
            <div className='InstructorDetailView'>
                <Bootstrap.PageHeader>
                    {(this.state.section.course || {}).subject} {(this.state.section.course || {}).catalog} <small>Class Number: {this.state.section.class_nbr}, {this.state.section.term_description}</small>
                </Bootstrap.PageHeader>

                <Bootstrap.Row>
                    <Bootstrap.Col xs={2}>
                        <h2>Course Title</h2>
                        <h4><Router.Link to='course-detail' params={{subject: (this.state.section.course || {}).subject || '', catalog_number: (this.state.section.course || {}).catalog || ''}}>
                            {(this.state.section.course || {}).course_title}
                        </Router.Link></h4>
                    </Bootstrap.Col>
                    <Bootstrap.Col xs={2}>
                        <h2>Instructor</h2>
                        <h4><Router.Link to='instructor-detail' params={{instructor_id: (this.state.section.instructor || {}).faculty_id || ''}}>{formattedName(this.state.section.instructor)}</Router.Link></h4>
                    </Bootstrap.Col>
                </Bootstrap.Row>

                <Bootstrap.TabbedArea defaultActiveKey={0}>
                    <Bootstrap.TabPane eventKey={0} tab='Students'>
                        <Bootstrap.Row>
                            <Bootstrap.Col xs={6}>
                                <h2>{this.state.students.length} Students</h2>
                                <DataTable simple data={this.state.students} onRowClick={this.onStudentRowClick}/>
                            </Bootstrap.Col>
                        </Bootstrap.Row>
                    </Bootstrap.TabPane>

                    <Bootstrap.TabPane eventKey={1} tab='Grade Distribution'>
                        <GradeDistribution students={this.state.students}/>
                    </Bootstrap.TabPane>
                </Bootstrap.TabbedArea>
            </div>
        );
    }
});

module.exports = InstructorDetailView;
