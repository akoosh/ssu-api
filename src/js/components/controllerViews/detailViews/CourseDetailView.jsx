// CourseDetailView.jsx
'use strict';

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var utils                   = require('../../../utils/schoolUtils');
var DataTable               = require('../../subviews/DataTable/DataTable');
var GradeDistribution       = require('../../subviews/GradeDistribution');
var TermHistory             = require('../../subviews/TermHistory');
var CourseDataStore         = require('../../../stores/CourseDataStore');
var SectionDataStore        = require('../../../stores/SectionDataStore');

function formattedName(obj) {
    return [obj.last_name, obj.first_name].join(', ');
}

function formattedSections(sections) {
    return sections.map(function(section) {
        return {
            term: section.term,
            class_number: section.class_nbr,
            instructor: formattedName(section.instructor),
            units: section.class_units === '0.00' ? '-' : section.class_units,
            section: section.section_number,
            component: section.component
        };
    });
}

var CourseDetailView = React.createClass({

    mixins: [Router.State, Router.Navigation],

    getInitialState: function() {
        return _.assign({}, this.getCourseState(), this.getSectionState());
    },

    getCourseState: function() {
        var params = this.getParams();
        var courseData = CourseDataStore.getDataForCourse(params.subject, params.catalog_number);
        return {
            course: courseData.course,
            sections: formattedSections(courseData.sections)
        };
    },

    getSectionState: function() {
        var params = this.getParams();
        var sectionData = SectionDataStore.getSectionDataForCourse(params.subject, params.catalog_number).filter(function(data) {
            return Boolean(utils.averageGrade(_.pluck(data.students, 'grade')));
        }).reverse();

        return {
            sectionData: sectionData
        };
    },

    onCourseChange: function() {
        this.setState(this.getCourseState());
    },

    onSectionChange: function() {
        this.setState(this.getSectionState());
    },

    componentDidMount: function() {
        CourseDataStore.addChangeListener(this.onCourseChange);
        SectionDataStore.addChangeListener(this.onSectionChange);

        var params = this.getParams();
        if (!CourseDataStore.hasDataForCourse(params.subject, params.catalog_number)) {
            AppActions.fetchDataForCourse(params.subject, params.catalog_number);
        }
    },

    componentWillUnmount: function() {
        CourseDataStore.removeChangeListener(this.onCourseChange);
        SectionDataStore.removeChangeListener(this.onSectionChange);
    },

    onSectionRowClick: function(section) {
        this.transitionTo('section-detail', {term: section.term, class_nbr: section.class_number});
    },

    sectionClickHandlerForSection: function(section) {
        return function(event) {
            this.transitionTo('section-detail', {term: section.term, class_nbr: section.class_nbr});
        }.bind(this);
    },

    render: function() {
        return (
            <div className='CourseDetailView'>
                <Bootstrap.PageHeader>
                    {this.state.course.subject} {this.state.course.catalog}: {this.state.course.course_title}
                </Bootstrap.PageHeader>

                <Bootstrap.Row>
                    <Bootstrap.Col xs={8}>
                        <h4>{this.state.course.course_description}</h4>
                    </Bootstrap.Col>
                </Bootstrap.Row>


                <Bootstrap.TabbedArea defaultActiveKey={0}>
                        <Bootstrap.TabPane eventKey={0} tab='Class History'>
                            <Bootstrap.Col xs={8}>
                                <TermHistory data={this.state.sections} onRowClick={this.onSectionRowClick}/>
                            </Bootstrap.Col>
                        </Bootstrap.TabPane>

                        <Bootstrap.TabPane eventKey={1} tab='Grade Distributions'>
                            {this.state.sectionData.map(function(data, i) {
                                return (
                                    <div key={i} onClick={this.sectionClickHandlerForSection(data.section)} className='clickable'>
                                        <h2>{data.section.term_description}: {formattedName(data.section.instructor)} <small>Class Number: {data.section.class_nbr}, Section: {data.section.section_number}, Students: {data.students.length}</small></h2>
                                        <GradeDistribution students={data.students}/>
                                    </div>
                                );
                            }.bind(this))}
                        </Bootstrap.TabPane>
                </Bootstrap.TabbedArea>
            </div>
        );
    }
});

module.exports = CourseDetailView;
