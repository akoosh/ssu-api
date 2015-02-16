// router.js
'use strict';

module.exports = function(express, db) {

    var router  = express.Router();

    router.get('/students', function(req, res) {
        db.getAllStudents(function(err, students) {
            if (err) {
                res.send(err);
            } else {
                res.json(students);
            }
        });
    });

    router.get('/students/:student_id', function(req, res) {
        db.getStudentById(req.params.student_id, function(err, student) {
            if (err) {
                res.send(err);
            } else {
                res.json(student);
            }
        });
    });

    router.get('/classes/:student_id', function(req, res) {
        db.getClassesByStudentId(req.params.student_id, function(err, classes) {
            if (err) {
                res.send(err);
            } else {
                res.json(classes);
            }
        });
    });

    router.put('/update/csv', function(req, res) {
        db.processUploadedFile(req.files.file.path, function(err) {
            if (err) {
                res.send(err);
            } else {
                res.sendStatus(201);
            }
        });
    });

    return router;
};
