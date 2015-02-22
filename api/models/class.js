// class.js
'use strict';

module.exports = function(mongoose, plugins) {

    var ObjectId = mongoose.Schema.Types.ObjectId;
    var schema = new mongoose.Schema({
        course: { type: ObjectId, ref: 'Course', required: true },
        instructor: { type: ObjectId, ref: 'Faculty', required: true },
        class_nbr: { type: String, required: true },
        term: { type: String, required: true },
        term_description: { type: String, required: true },
        section: { type: String, required: true },
        component: { type: String, required: true },
        designation: { type: String, required: false },
        meetings: [{
            facil_id: { type: String, required: false },
            mtg_start: { type: String, required: true },
            mtg_end: { type: String, required: true },
            pat: { type: String, required: true }
        }]
    });

    // Cannot have the same class twice
    schema.index({class_nbr: 1, term: 1}, {unique: true});

    plugins.forEach(function(plugin) {
        schema.plugin(plugin);
    });

    return mongoose.model('Class', schema);
};
