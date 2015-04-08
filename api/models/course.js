// course.js
'use strict';

var mongoose = require('mongoose');
var plugins  = require('../utils/mongoosePlugins');

var schema = new mongoose.Schema({
    key: { type: String, hide: true, required: true, index: {unique: true} },
    subject: { type: String, required: true },
    catalog: { type: String, required: true },
    course_title: { type: String, required: true},
    course_description: { type: String, required: false},
    min_units: { type: String, required: true },
    max_units: { type: String, required: true }
});

plugins.forEach(function(plugin) {
    schema.plugin(plugin);
});

module.exports = mongoose.model('Course', schema);
