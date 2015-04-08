// student.js
'use strict';

var mongoose = require('mongoose');
var plugins  = require('../utils/mongoosePlugins');

var schema = new mongoose.Schema({
    student_id: { type: String, required: true, index: {unique: true } },
    last_name: { type: String, required: true },
    first_name: { type: String, required: true },
    gender: { type: String, required: true },
    ethnic_grp: { type: String, required: true }
});

plugins.forEach(function(plugin) {
    schema.plugin(plugin);
});

module.exports = mongoose.model('Student', schema);
