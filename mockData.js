var mongoose   = require('mongoose');
var faker      = require('faker');
var Student    = require('./api/models/student')(mongoose);

mongoose.connect('mongodb://localhost/students');

var NUM_TO_SAVE = 5;

for (var i = 0; i < NUM_TO_SAVE; i++) {
    var student = new Student({
        sid: String('00000000' + faker.helpers.randomNumber(10000000)).slice(-9),
        name: [faker.name.firstName(), faker.name.lastName()].join(' '),
        major: ['CS', 'MATH', 'CHEM', 'BIOL', 'ENGL'][faker.helpers.randomNumber(4)],
        gpa: Number((faker.helpers.randomNumber(100) / 50 + 2).toPrecision(3))
    });

    student.save(function(err) {
        if (err) {
            console.log(err);
            console.log('Student was not saved:');
            console.log(student);
        } else {
            console.log('Student saved:');
            console.log(student);
        }
    });
}
