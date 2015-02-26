var ServerActions = require('../actions/ServerActions');
var $             = require('jquery');

function makeApiRequest(url, callback) {
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(students) {
            callback(null, students);
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(url, status, err.toString());
            callback(err);
        }.bind(this)
    });
}

var AppApi = {};

AppApi.getStudents = function() {
    makeApiRequest('api/v0/students', function(err, students) {
        if (!err) {
            ServerActions.receiveData(students, 'students');
        }
    });
};

AppApi.getInstructors = function() {
    makeApiRequest('api/v0/instructors', function(err, instructors) {
        if (!err) {
            ServerActions.receiveData(instructors, 'instructors');
        }
    });
};

module.exports = AppApi;
