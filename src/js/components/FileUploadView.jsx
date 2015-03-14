/** @jsx React.DOM */

var React      = require('react');
var Bootstrap  = require('react-bootstrap');
var AppActions = require('../actions/AppActions');

var FileUploadView = React.createClass({

    statics: {
        willTransitionTo: function(transition, params, query) {
            // console.log('willTransitionTo FileUploadView');
        }
    },

    render: function() {
        return (
            <div className='FileUploadView'>
                <Bootstrap.PageHeader>File Upload</Bootstrap.PageHeader>
                <Bootstrap.Input type="file" label="File" />
            </div>
        );
    }
});

module.exports = FileUploadView;
