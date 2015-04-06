// models.js
'use strict';

var mongoose = require('mongoose');
var plugins  = require('./utils/mongoosePlugins');

module.exports = {
    Student     : require('./models/student')(mongoose, plugins),
    Faculty     : require('./models/faculty')(mongoose, plugins),
    Course      : require('./models/course')(mongoose, plugins),
    Class       : require('./models/class')(mongoose, plugins),
    Enrollment  : require('./models/enrollment')(mongoose, plugins),
    Advisement  : require('./models/advisement')(mongoose, plugins),
    Requisite   : require('./models/requisite')(mongoose, plugins)
};
