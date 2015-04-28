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

// Student

function getStudents(callback) {
    makeApiGetRequest('api/v0/students', callback);
}

function getStudentById(student_id, callback) {
    var path = 'api/v0/students/' + student_id;
    makeApiGetRequest(path, callback);
}

function getAdvisorsByStudentId(student_id, callback) {
    var path = 'api/v0/students/' + student_id + '/advisors';
    makeApiGetRequest(path, callback);
}

function getSectionsByStudentId(student_id, callback) {
    var path = 'api/v0/students/' + student_id + '/sections';
    makeApiGetRequest(path, callback);
}

// Instructor

function getInstructors(callback) {
    makeApiGetRequest('api/v0/instructors', callback);
}

function getInstructorById(instructor_id, callback) {
    var path = 'api/v0/instructors/' + instructor_id;
    makeApiGetRequest(path, callback);
}

function getSectionsByInstructorId(instructor_id, callback) {
    var path = 'api/v0/instructors/' + instructor_id + '/sections';
    makeApiGetRequest(path, callback);
}

// Advisor

function getAdvisors(callback) {
    makeApiGetRequest('api/v0/advisors', callback);
}

function getAdvisorById(advisor_id, callback) {
    var path = 'api/v0/advisors/' + advisor_id;
    makeApiGetRequest(path, callback);
}

function getStudentsByAdvisorId(advisor_id, callback) {
    var path = 'api/v0/advisors/' + advisor_id + '/students';
    makeApiGetRequest(path, callback);
}

// Course

function getCourses(callback) {
    makeApiGetRequest('api/v0/courses', callback);
}

function getCourseBySubjectAndCatalogNumber(subject, catalog_number, callback) {
    var path = 'api/v0/courses/subjects/' + subject + '/' + catalog_number;
    makeApiGetRequest(path, callback);
}

function getSectionsBySubjectAndCatalogNumber(subject, catalog_number, callback) {
    var path = 'api/v0/courses/subjects/' + subject + '/' + catalog_number + '/sections';
    makeApiGetRequest(path, callback);
}

// Section

function getSectionByTermAndClassNumber(term, class_nbr, callback) {
    var path = 'api/v0/sections/terms/' + term + '/' + class_nbr;
    makeApiGetRequest(path, callback);
}

function getStudentsInSectionByTermAndClassNumber(term, class_nbr, callback) {
    var path = 'api/v0/sections/terms/' + term + '/' + class_nbr + '/students';
    makeApiGetRequest(path, callback);
}

module.exports = {
    getStudents:                                getStudents,
    getStudentById:                             getStudentById,
    getAdvisorsByStudentId:                     getAdvisorsByStudentId,
    getSectionsByStudentId:                     getSectionsByStudentId,
    getInstructors:                             getInstructors,
    getInstructorById:                          getInstructorById,
    getSectionsByInstructorId:                  getSectionsByInstructorId,
    getAdvisors:                                getAdvisors,
    getAdvisorById:                             getAdvisorById,
    getStudentsByAdvisorId:                     getStudentsByAdvisorId,
    getCourses:                                 getCourses,
    getCourseBySubjectAndCatalogNumber:         getCourseBySubjectAndCatalogNumber,
    getSectionsBySubjectAndCatalogNumber:       getSectionsBySubjectAndCatalogNumber,
    getSectionByTermAndClassNumber:             getSectionByTermAndClassNumber,
    getStudentsInSectionByTermAndClassNumber:   getStudentsInSectionByTermAndClassNumber
};
