// enrollment.js
'use strict';

var mongoose = require('mongoose');
var plugins  = require('../utils/mongoosePlugins');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
    student: { type: ObjectId, ref: 'Student', required: true },
    section: { type: ObjectId, ref: 'Section', required: true },
    reason: { type: String, required: true },
    add_dt: { type: Date, required: true },
    grade: { type: String, required: false },
});

// A student cannot be enrolled in the same section twice
schema.index({student: 1, section: 1}, {unique: true});

plugins.forEach(function(plugin) {
    schema.plugin(plugin);
});

module.exports = mongoose.model('Enrollment', schema);
