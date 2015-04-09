// models.js
'use strict';

module.exports = {
    Student     : require('./models/student'),
    Faculty     : require('./models/faculty'),
    Course      : require('./models/course'),
    Section     : require('./models/section'),
    Enrollment  : require('./models/enrollment'),
    Advisement  : require('./models/advisement'),
    Requisite   : require('./models/requisite')
};
