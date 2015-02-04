// router.js

module.exports = function(express, db) {
    'use strict';

    var router  = express.Router();

    router.use(function(req, res, next) {
        console.log('Something is happening.');
        next();
    });

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

    return router;
};
