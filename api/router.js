// router.js
'use strict';

module.exports = function(express, db) {

    var router  = express.Router();

    var getRequestHandler = function(res) {
        return function(err, product) {
            if (err) {
                res.send(err);
            } else {
                res.json(product);
            }
        };
    };

    var postRequestHandler = function(res) {
        return function(err, product) {
            if (err) {
                res.send(err);
            } else {
                res.sendStatus(201);
            }
        };
    };


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

    router.get('/students/:student_id/classes', function(req, res) {
        db.getClassesByStudentId(req.params.student_id, getRequestHandler(res));
    });


    // Instructor routes

    router.get('/instructors', function(req, res) {
        db.getAllInstructors(getRequestHandler(res));
    });

    router.get('/instructors/:instructor_id', function(req, res) {
        db.getInstructorById(req.params.instructor_id, getRequestHandler(res));
    });

    router.get('/instructors/:instructor_id/classes', function(req, res) {
        db.getClassesByInstructorId(req.params.instructor_id, getRequestHandler(res));
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

    router.get('/courses/subjects/:subject/:catalog_number/classes', function(req, res) {
        db.getClassesBySubjectAndCatalogNumber(req.params.subject, req.params.catalog_number, getRequestHandler(res));
    });


    // Class routes

    router.get('/classes', function(req, res) {
        db.getAllClasses(getRequestHandler(res));
    });

    router.get('/classes/terms', function(req, res) {
        db.getAllTerms(getRequestHandler(res));
    });

    router.get('/classes/terms/:term', function(req, res) {
        db.getAllClassesByTerm(req.params.term, getRequestHandler(res));
    });

    router.get('/classes/terms/:term/:class_number', function(req, res) {
        db.getClassByTermAndClassNumber(req.params.term, req.params.class_number, getRequestHandler(res));
    });

    router.get('/classes/terms/:term/:class_number/students', function(req, res) {
        db.getAllStudentsInClassByTermAndClassNumber(req.params.term, req.params.class_number, getRequestHandler(res));
    });


    // Requiste routes

    router.get('/requisites', function(req, res) {
        db.getAllRequisites(getRequestHandler(res));
    });


    // Data loading routes

    router.post('/courses', function(req, res) {
        db.processCourses(req.files.file.path, postRequestHandler(res));
    });

    router.post('/requisites', function(req, res) {
        db.processRequisites(req.files.file.path, postRequestHandler(res));
    });

    router.post('/enrollments', function(req, res) {
        db.processEnrollments(req.files.file.path, postRequestHandler(res));
    });

    return router;
};
