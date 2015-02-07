// router.js

module.exports = function(express, db) {
    'use strict';

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

    router.get('/students/:sid', function(req, res) {
        db.getStudentById(req.params.sid, function(err, student) {
            if (err) {
                res.send(err);
            } else {
                res.json(student);
            }
        });
    });

    router.post('/update/csv', function(req, res) {
        res.send("Thank you!");
    });

    return router;
};
