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

    var putRequestHandler = function(res) {
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


    // Data loading routes

    router.put('/update/csv', function(req, res) {
        db.processUploadedFile(req.files.file.path, putRequestHandler(res));
    });

    return router;
};
