var mongoose   = require('mongoose');
var faker      = require('faker');
var Student    = require('./api/models/student')(mongoose);

mongoose.connect('mongodb://localhost/students');

var NUM_TO_SAVE = 5;
var num_saved = 0;

function saveCallback(err, student) {
    num_saved++;

    if (err) {
        console.log(err);
        console.log('Student was not saved.');
    } else {
        console.log('Student saved: ' + student.first_name);
    }

    if (num_saved === NUM_TO_SAVE) {
        mongoose.disconnect();
    }
}

for (var i = 0; i < NUM_TO_SAVE; i++) {
    var student = new Student({
        student_id: String('00000000' + faker.helpers.randomNumber(10000000)).slice(-9),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        acad_plan: 'test',
        acad_plan_descr: 'test',
        gender: 'test',
        ethnic_grp: 'test'
    });

    student.save(saveCallback);
}
