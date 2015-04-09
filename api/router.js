// router.js
'use strict';

var router      = require('express').Router();
var db          = require('./database');

function getRequestHandler(res) {
    return function(err, product) {
        if (err) {
            res.send(err);
        } else {
            res.status(200);
            res.json(product);
        }
    };
}

function postRequestHandler(res) {
    return function(err, product) {
        if (err) {
            res.send(err);
        } else {
            res.sendStatus(201);
        }
    };
}

// Student routes

router.get('/students', function(req, res) {
    db.getAllStudents(getRequestHandler(res));
});

router.get('/students/:student_id', function(req, res) {
    db.getStudentById(req.params.student_id, getRequestHandler(res));
});

router.get('/students/:student_id/advisors', function(req, res) {
    db.getAdvisorsByStudentId(req.params.student_id, getRequestHandler(res));
});

router.get('/students/:student_id/sections', function(req, res) {
    db.getSectionsByStudentId(req.params.student_id, getRequestHandler(res));
});


// Instructor routes

router.get('/instructors', function(req, res) {
    db.getAllInstructors(getRequestHandler(res));
});

router.get('/instructors/:instructor_id', function(req, res) {
    db.getInstructorById(req.params.instructor_id, getRequestHandler(res));
});

router.get('/instructors/:instructor_id/sections', function(req, res) {
    db.getSectionsByInstructorId(req.params.instructor_id, getRequestHandler(res));
});


// Advisor routes

router.get('/advisors', function(req, res) {
    db.getAllAdvisors(getRequestHandler(res));
});

router.get('/advisors/:advisor_id', function(req, res) {
    db.getAdvisorById(req.params.advisor_id, getRequestHandler(res));
});

router.get('/advisors/:advisor_id/students', function(req, res) {
    db.getStudentsByAdvisorId(req.params.advisor_id, getRequestHandler(res));
});


// Course routes

router.get('/courses', function(req, res) {
    db.getAllCourses(getRequestHandler(res));
});

router.get('/courses/subjects', function(req, res) {
    db.getAllSubjects(getRequestHandler(res));
});

router.get('/courses/subjects/:subject', function(req, res) {
    db.getCoursesBySubject(req.params.subject, getRequestHandler(res));
});

router.get('/courses/subjects/:subject/:catalog_number', function(req, res) {
    db.getCourseBySubjectAndCatalogNumber(req.params.subject, req.params.catalog_number, getRequestHandler(res));
});

router.get('/courses/subjects/:subject/:catalog_number/sections', function(req, res) {
    db.getSectionsBySubjectAndCatalogNumber(req.params.subject, req.params.catalog_number, getRequestHandler(res));
});

router.get('/courses/subjects/:subject/:catalog_number/eligible', function(req, res) {
    db.getEligibleStudentsBySubjectAndCatalogNumber(req.params.subject, req.params.catalog_number, getRequestHandler(res));
});


// Section routes

router.get('/sections', function(req, res) {
    db.getAllSections(getRequestHandler(res));
});

router.get('/sections/terms', function(req, res) {
    db.getAllTerms(getRequestHandler(res));
});

router.get('/sections/terms/:term', function(req, res) {
    db.getAllSectionsByTerm(req.params.term, getRequestHandler(res));
});

router.get('/sections/terms/:term/:class_number', function(req, res) {
    db.getSectionByTermAndClassNumber(req.params.term, req.params.class_number, getRequestHandler(res));
});

router.get('/sections/terms/:term/:class_number/students', function(req, res) {
    db.getAllStudentsInSectionByTermAndClassNumber(req.params.term, req.params.class_number, getRequestHandler(res));
});



// Requiste routes

router.get('/requisites', function(req, res) {
    db.getAllRequisites(getRequestHandler(res));
});


// Data loading routes

router.post('/courses', function(req, res) {
    db.processFileWithSchema('courses', req.files.file.path, postRequestHandler(res));
});

router.post('/requisites', function(req, res) {
    db.processFileWithSchema('requisites', req.files.file.path, postRequestHandler(res));
});

router.post('/enrollments', function(req, res) {
    db.processFileWithSchema('enrollments', req.files.file.path, postRequestHandler(res));
});

module.exports = router;
