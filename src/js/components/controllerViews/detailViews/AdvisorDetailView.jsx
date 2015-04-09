/** @jsx React.DOM */

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var AdvisorDataStore        = require('../../../stores/AdvisorDataStore');

function formattedName(obj) {
    return [obj.last_name, obj.first_name].join(', ');
}

function formattedStudents(students) {
    return students.map(function(student) {
        return {
            student_id: student.student.student_id,
            first_name: student.student.first_name,
            last_name: student.student.last_name,
            gender: student.student.gender,
            ethnic_group: student.student.ethnic_grp,
            term: student.term_description,
            academic_plan: student.acad_plan_descr
        };
    });
}

function formattedStudentsByTerm(students) {
    return _.groupBy(formattedStudents(students), 'term');
}

function getViewState() {
    var data = AdvisorDataStore.getAdvisorData();
    return {
        advisor: data.advisor,
        studentsByTerm: formattedStudentsByTerm(data.students)
    };
}

var InstructorDetailView = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function() {
        return getViewState();
    },

    onChange: function() {
        this.setState(getViewState());
    },

    componentDidMount: function() {
        AdvisorDataStore.addChangeListener(this.onChange);

        var params = this.getParams();
        AppActions.fetchDataForAdvisor(this.getParams().advisor_id);
    },

    componentWillUnmount: function() {
        AdvisorDataStore.removeChangeListener(this.onChange);
    },

    onStudentRowClick: function(student) {
        this.transitionTo('student-detail', {student_id: student.student_id});
    },

    render: function() {
        return (
            <div className='InstructorDetailView'>
                <Bootstrap.PageHeader>
                    {this.state.advisor.first_name} {this.state.advisor.last_name} <small>Advisor ID: {this.state.advisor.faculty_id}</small>
                </Bootstrap.PageHeader>

                <Bootstrap.TabbedArea defaultActiveKey={0}>
                    {Object.keys(this.state.studentsByTerm).reverse().map(function(term, i) {
                        return (
                            <Bootstrap.TabPane key={i} eventKey={i} tab={term}>
                                <h2>Advisees</h2>
                                <DataTable clickable data={this.state.studentsByTerm[term]} onRowClick={this.onStudentRowClick}/>
                            </Bootstrap.TabPane>
                        );
                    }.bind(this))}
                </Bootstrap.TabbedArea>
            </div>
        );
    }
});

module.exports = InstructorDetailView;
