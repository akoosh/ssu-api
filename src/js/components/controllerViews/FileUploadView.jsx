/** @jsx React.DOM */

var React      = require('react');
var Bootstrap  = require('react-bootstrap');
var AppActions = require('../../actions/AppActions');

var FileUploadView = React.createClass({

    getInitialState: function() {
        return {
            isWaiting: false
        };
    },

    onSubmit: function(event) {
        event.preventDefault();

        var formData = new FormData(event.target);
        var xhr = new XMLHttpRequest();

        xhr.open('POST', 'api/v0/update/csv', true);
        xhr.onload = function(e) {
            console.log(xhr);
            this.setState({isWaiting: false});
        }.bind(this);
        xhr.send(formData);
        this.setState({isWaiting: true});
    },

    render: function() {
        var waiting = this.state.isWaiting ? <span>Waiting...</span> : null;
        return (
            <div className='FileUploadView'>
                <Bootstrap.PageHeader>File Upload</Bootstrap.PageHeader>
                <form encType='multipart/form-data' method='POST' onSubmit={this.onSubmit}>
                    <Bootstrap.Input type='file' name='file' label='Enrollment File'/>
                    <Bootstrap.Input type='submit' value='Submit'/>
                    {waiting}
                </form>
            </div>
        );
    }
});

module.exports = FileUploadView;
