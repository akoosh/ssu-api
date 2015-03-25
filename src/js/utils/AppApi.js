var $             = require('jquery');

function makeApiRequest(url, callback) {
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data) {
            callback(null, data);
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(url, status, err.toString());
            callback(err);
        }.bind(this)
    });
}

var AppApi = {};

AppApi.getStudents = function(callback) {
    makeApiRequest('api/v0/students', function(err, students) {
        if (err) {
            callback(err);
        } else {
            callback(null, students);
        }
    }.bind(this));
};

AppApi.getStudentById = function(student_id, callback) {
    var path = 'api/v0/students/' + student_id;
    makeApiRequest(path, function(err, student) {
        if (err) {
            callback(err);
        } else {
            callback(null, student);
        }
    }.bind(this));
};

AppApi.getAdvisorsByStudentId = function(student_id, callback) {
    var path = 'api/v0/students/' + student_id + '/advisors';
    makeApiRequest(path, function(err, advisors) {
        if (err) {
            callback(err);
        } else {
            callback(null, advisors);
        }
    }.bind(this));
};

AppApi.getSectionsByStudentId = function(student_id, callback) {
    var path = 'api/v0/students/' + student_id + '/classes';
    makeApiRequest(path, function(err, sections) {
        if (err) {
            callback(err);
        } else {
            callback(null, sections);
        }
    }.bind(this));
};

AppApi.getInstructors = function(callback) {
    makeApiRequest('api/v0/instructors', function(err, instructors) {
        if (err) {
            callback(err);
        } else {
            callback(null, instructors);
        }
    }.bind(this));
};

AppApi.getAdvisors = function(callback) {
    makeApiRequest('api/v0/advisors', function(err, advisors) {
        if (err) {
            callback(err);
        } else {
            callback(null, advisors);
        }
    }.bind(this));
};

AppApi.getCourses = function(callback) {
    makeApiRequest('api/v0/courses', function(err, courses) {
        if (err) {
            callback(err);
        } else {
            callback(null, courses);
        }
    }.bind(this));
};

module.exports = AppApi;
