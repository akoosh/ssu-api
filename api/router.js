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

    // router.get('/students/:student_id/advisors', function(req, res) {
    //     db.getAdvisorsByStudentId(req.params.student_id, getRequestHandler(res));
    // });

    router.get('/students/:student_id/classes', function(req, res) {
        db.getClassesByStudentId(req.params.student_id, getRequestHandler(res));
    });


    // Advisor routes

    // router.get('/advisors', function(req, res) {
    //     db.getAllAdvisors(getRequestHandler(res));
    // });

    // router.get('/advisors/:faculty_id', function(req, res) {
    //     db.getAdvisorById(req.params.faculty_id, getRequestHandler(res));
    // });

    // router.get('/advisors/:faculty_id/students', function(req, res) {
    //     db.getStudentByAvisorId(req.params.faculty_id, getRequestHandler(res));
    // });


    // Data loading routes

    router.put('/update/csv', function(req, res) {
        db.processUploadedFile(req.files.file.path, putRequestHandler(res));
    });

    return router;
};
