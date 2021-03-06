// advisement.js
'use strict';

var mongoose = require('mongoose');
var plugins  = require('../utils/mongoosePlugins');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
    student: { type: ObjectId, ref: 'Student', required: true },
    advisor: { type: ObjectId, ref: 'Faculty', required: true },
    term: { type: String, required: true },
    term_description: { type: String, required: true },
    acad_plan: { type: String, required: true },
    acad_plan_descr: { type: String, required: true }
});

// A student cannot have the same advisor twice in the same term
schema.index({student: 1, advisor: 1, term: 1}, {unique: true});

plugins.forEach(function(plugin) {
    schema.plugin(plugin);
});

module.exports = mongoose.model('Advisement', schema);
