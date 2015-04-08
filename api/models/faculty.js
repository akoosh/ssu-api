// facutly.js
'use strict';

var mongoose = require('mongoose');
var plugins  = require('../utils/mongoosePlugins');

var schema = new mongoose.Schema({
    faculty_id: { type: String, required: true, index: {unique: true } },
    last_name: { type: String, required: true },
    first_name: { type: String, required: false }
});

plugins.forEach(function(plugin) {
    schema.plugin(plugin);
});

module.exports = mongoose.model('Faculty', schema);
