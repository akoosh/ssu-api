// class.js
'use strict';

var mongoose = require('mongoose');
var plugins  = require('../utils/mongoosePlugins');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
    // This 'key' property is a concatenation of 'term' + 'class_nbr',
    // a class in term '2147' with class number '3295' has a key '21473295'
    key: { type: String, hide: true, required: true, index: {unique: true} },
    course: { type: ObjectId, ref: 'Course', required: true },
    instructor: { type: ObjectId, ref: 'Faculty', required: true },
    term: { type: String, required: true },
    class_nbr: { type: String, required: true },
    class_units: { type: String, required: false },
    class_type: { type: String, required: false },
    term_description: { type: String, required: true },
    section_number: { type: String, required: true },
    component: { type: String, required: true },
    designation: { type: String, required: false },
    meetings: [{
        facil_id: { type: String, required: false },
        mtg_start: { type: String, required: true },
        mtg_end: { type: String, required: true },
        pat: { type: String, required: false }
    }]
});

plugins.forEach(function(plugin) {
    schema.plugin(plugin);
});

module.exports = mongoose.model('Class', schema);
