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
    makeApiRequest('api/v0/students', callback);
};

AppApi.getStudentById = function(student_id, callback) {
    var path = 'api/v0/students/' + student_id;
    makeApiRequest(path, callback);
};

AppApi.getAdvisorsByStudentId = function(student_id, callback) {
    var path = 'api/v0/students/' + student_id + '/advisors';
    makeApiRequest(path, callback);
};

AppApi.getSectionsByStudentId = function(student_id, callback) {
    var path = 'api/v0/students/' + student_id + '/classes';
    makeApiRequest(path, callback);
};

AppApi.getInstructors = function(callback) {
    makeApiRequest('api/v0/instructors', callback);
};

AppApi.getInstructorById = function(instructor_id, callback) {
    var path = 'api/v0/instructors/' + instructor_id;
    makeApiRequest(path, callback);
};

AppApi.getSectionsByInstructorId = function(instructor_id, callback) {
    var path = 'api/v0/instructors/' + instructor_id + '/classes';
    makeApiRequest(path, callback);
};

AppApi.getAdvisors = function(callback) {
    makeApiRequest('api/v0/advisors', callback);
};

AppApi.getAdvisorById = function(advisor_id, callback) {
    var path = 'api/v0/advisors/' + advisor_id;
    makeApiRequest(path, callback);
};

AppApi.getStudentsByAdvisorId = function(advisor_id, callback) {
    var path = 'api/v0/advisors/' + advisor_id + '/students';
    makeApiRequest(path, callback);
};

AppApi.getCourses = function(callback) {
    makeApiRequest('api/v0/courses', callback);
};

AppApi.getSectionByTermAndClassNumber = function(term, class_nbr, callback) {
    var path = 'api/v0/classes/terms/' + term + '/' + class_nbr;
    makeApiRequest(path, callback);
};

AppApi.getStudentsInSectionByTermAndClassNumber = function(term, class_nbr, callback) {
    var path = 'api/v0/classes/terms/' + term + '/' + class_nbr + '/students';
    makeApiRequest(path, callback);
};

module.exports = AppApi;
