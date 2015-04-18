// SectionDetailView.jsx
'use strict';

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var BarChart                = require('react-d3/barchart').BarChart;
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
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

function gradeDistribution(students) {
    var dist = _.groupBy(students, 'grade');

    return [
        'F',
        'D-',
        'D',
        'D+',
        'C-',
        'C',
        'C+',
        'B-',
        'B',
        'B+',
        'A-',
        'A'
    ].map(function(grade) {
        return {
            label: grade,
            value: (dist[grade] || []).length
        };
    });
}

function averageGrade(grades) {
    if (grades.length) {
        var gradePoints = grades.map(utils.gradePointsFromGrade);
        var average = _.sum(gradePoints) / gradePoints.length;

        return utils.nearestGradeFromGradePoints(average);
    } else {
        return '';
    }
}

function passRate(grades, required) {
    var passing = grades.filter(function(grade) {
        return utils.gradePointsFromGrade(grade) >= utils.gradePointsFromGrade(required);
    });

    return (passing.length / grades.length) || 0;
}

var InstructorDetailView = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function() {
        return this.getViewState();
    },

    getViewState: function() {
        var params = this.getParams();
        var data = SectionDataStore.getDataForSection(params.term, params.class_nbr);
        var grades = _.pluck(data.students, 'grade');
        return {
            section: data.section,
            students: formattedStudents(data.students),
            gradeDistribution: gradeDistribution(data.students),
            averageGrade: averageGrade(grades),
            majorPassRate: passRate(grades, 'C-'),
            generalPassRate: passRate(grades, 'D-')
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
                                <DataTable simple clickable data={this.state.students} onRowClick={this.onStudentRowClick}/>
                            </Bootstrap.Col>
                        </Bootstrap.Row>
                    </Bootstrap.TabPane>

                    <Bootstrap.TabPane eventKey={1} tab='Grade Distribution'>
                        <Bootstrap.Row>
                            <Bootstrap.Col xs={4}>
                                <Bootstrap.Table>
                                    <tr><th>Average Grade</th><td>{this.state.averageGrade}</td></tr>
                                    <tr><th>General Pass Rate</th><td>{(this.state.generalPassRate * 100).toFixed(0)}%</td></tr>
                                    <tr><th>Major Pass Rate</th><td>{(this.state.majorPassRate * 100).toFixed(0)}%</td></tr>
                                </Bootstrap.Table>
                                <BarChart data={this.state.gradeDistribution} width={800} height={200} fill={'#3182bd'}/>
                            </Bootstrap.Col>
                        </Bootstrap.Row>
                    </Bootstrap.TabPane>
                </Bootstrap.TabbedArea>
            </div>
        );
    }
});

module.exports = InstructorDetailView;
