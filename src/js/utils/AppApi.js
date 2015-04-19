// AppApi.js
'use strict';

function makeApiGetRequest(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            callback(null, data || []);
        } else {
            callback('server error');
        }
    };

    request.onerror = function() {
        callback('xhr error');
    };

    request.send();
}

var AppApi = {};

// Student

AppApi.getStudents = function(callback) {
    makeApiGetRequest('api/v0/students', callback);
};

AppApi.getStudentById = function(student_id, callback) {
    var path = 'api/v0/students/' + student_id;
    makeApiGetRequest(path, callback);
};

AppApi.getAdvisorsByStudentId = function(student_id, callback) {
    var path = 'api/v0/students/' + student_id + '/advisors';
    makeApiGetRequest(path, callback);
};

AppApi.getSectionsByStudentId = function(student_id, callback) {
    var path = 'api/v0/students/' + student_id + '/sections';
    makeApiGetRequest(path, callback);
};

// Instructor

AppApi.getInstructors = function(callback) {
    makeApiGetRequest('api/v0/instructors', callback);
};

AppApi.getInstructorById = function(instructor_id, callback) {
    var path = 'api/v0/instructors/' + instructor_id;
    makeApiGetRequest(path, callback);
};

AppApi.getSectionsByInstructorId = function(instructor_id, callback) {
    var path = 'api/v0/instructors/' + instructor_id + '/sections';
    makeApiGetRequest(path, callback);
};

// Advisor

AppApi.getAdvisors = function(callback) {
    makeApiGetRequest('api/v0/advisors', callback);
};

AppApi.getAdvisorById = function(advisor_id, callback) {
    var path = 'api/v0/advisors/' + advisor_id;
    makeApiGetRequest(path, callback);
};

AppApi.getStudentsByAdvisorId = function(advisor_id, callback) {
    var path = 'api/v0/advisors/' + advisor_id + '/students';
    makeApiGetRequest(path, callback);
};

// Course

AppApi.getCourses = function(callback) {
    makeApiGetRequest('api/v0/courses', callback);
};

AppApi.getCourseBySubjectAndCatalogNumber = function(subject, catalog_number, callback) {
    var path = 'api/v0/courses/subjects/' + subject + '/' + catalog_number;
    makeApiGetRequest(path, callback);
};

AppApi.getSectionsBySubjectAndCatalogNumber = function(subject, catalog_number, callback) {
    var path = 'api/v0/courses/subjects/' + subject + '/' + catalog_number + '/sections';
    makeApiGetRequest(path, callback);
};

// Section

AppApi.getSectionByTermAndClassNumber = function(term, class_nbr, callback) {
    var path = 'api/v0/sections/terms/' + term + '/' + class_nbr;
    makeApiGetRequest(path, callback);
};

AppApi.getStudentsInSectionByTermAndClassNumber = function(term, class_nbr, callback) {
    var path = 'api/v0/sections/terms/' + term + '/' + class_nbr + '/students';
    makeApiGetRequest(path, callback);
};

module.exports = AppApi;
