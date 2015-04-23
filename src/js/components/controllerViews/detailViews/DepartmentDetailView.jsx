// DepartmentDetailView.jsx
'use strict';

var React                   = require('react');
var Router                  = require('react-router');
var Bootstrap               = require('react-bootstrap');
var _                       = require('lodash');
var AppActions              = require('../../../actions/AppActions');
var DataTable               = require('../../subviews/DataTable/DataTable');
var AdvisorDataStore        = require('../../../stores/AdvisorDataStore');

var DepartmentDetailView = React.createClass({

    mixins: [Router.State, Router.Navigation],

    render: function() {
        return (
            <div className='DepartmentDetailView'>
                <Bootstrap.PageHeader>{this.getParams().subject} Department</Bootstrap.PageHeader>
            </div>
        );
    }
});

module.exports = DepartmentDetailView;
