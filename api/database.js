// database.js

module.exports = function(mongoose) {
    'use strict';

    mongoose.connect('mongodb://localhost/students');

    return {
        Student: require('./models/student')(mongoose),
        Faculty: require('./models/faculty')(mongoose),
        Course:  require('./models/course')(mongoose),
        Class:   require('./models/class')(mongoose)
    };
};
