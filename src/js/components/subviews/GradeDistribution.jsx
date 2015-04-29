// GradeDistribution.jsx
'use strict';

var React       = require('react');
var Bootstrap   = require('react-bootstrap');
var BarChart    = require('react-d3/barchart').BarChart;
var _           = require('lodash');
var utils       = require('../../utils/schoolUtils');

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

var GradeDistribution = React.createClass({

    propTypes: {
        // Array of student objects that must contain the 'grade' property
        students: React.PropTypes.array.isRequired
    },

    getInitialState: function() {
        return {
            gradeDistribution: [],
            averageGrade: '',
            majorPassRate: '',
            generalPassRate: ''
        };
    },

    setDerivedState: function(props) {
        var students = props.students;
        var grades = _.pluck(students, 'grade');

        this.setState({
            gradeDistribution: gradeDistribution(students),
            averageGrade: averageGrade(grades),
            majorPassRate: passRate(grades, 'C-'),
            generalPassRate: passRate(grades, 'D-')
        });
    },

    componentWillMount: function() {
        this.setDerivedState(this.props);
    },

    componentWillReceiveProps: function(nextProps) {
        this.setDerivedState(nextProps);
    },

    render: function() {
        return (
            <Bootstrap.Row className='GradeDistribution'>
                <Bootstrap.Col xs={2}>
                    <Bootstrap.Table>
                        <tr><th>Average Grade</th><td>{this.state.averageGrade}</td></tr>
                        <tr><th>General Pass Rate</th><td>{(this.state.generalPassRate * 100).toFixed(0)}%</td></tr>
                        <tr><th>Major Pass Rate</th><td>{(this.state.majorPassRate * 100).toFixed(0)}%</td></tr>
                    </Bootstrap.Table>
                </Bootstrap.Col>
                <BarChart data={this.state.gradeDistribution} width={800} height={200} fill={'#3182bd'}/>
            </Bootstrap.Row>
        );
    }
});

module.exports = GradeDistribution;
