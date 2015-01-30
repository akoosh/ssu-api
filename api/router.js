// router.js

module.exports = function(express, mongoose) {
    var db      = require('./database')(mongoose);
    var router  = express.Router();

    router.use(function(req, res, next) {
        console.log('Something is happening.');
        next();
    });

    router.get('/students', function(req, res) {
        db.Student.find(function(err, students) {
            if (err)
                res.send(err);

            res.json(students);
        });
    });

    router.get('/:major/students', function(req, res) {
        db.Student.find({major: req.params.major}, function(err, students) {
            if (err)
                res.send(err);

            res.json(students);
        });
    });

    router.get('/students/:sid', function(req, res) {
        db.Student.find({sid: req.params.sid}, function(err, students) {
            if (err)
                res.send(err);

            res.json(students);
        });
    });

    return router;
};
