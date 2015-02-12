// class.js

module.exports = function(mongoose) {
    'use strict';

    var ObjectId = mongoose.Schema.Types.ObjectId;
    var schema = new mongoose.Schema({
        course: { type: ObjectId, required: true },
        instructor: { type: ObjectId, required: true },
        class_nbr: { type: String, required: true },
        term: { type: String, required: true },
        term_description: { type: String, required: true },
        section: { type: String, required: true },
        component: { type: String, required: true },
        designation: { type: String, required: false },
        facil_id: { type: String, required: false },
        mtg_start: { type: String, required: true },
        mtg_end: { type: String, required: true },
        pat: { type: String, required: true }
    });

    // Cannot have the same class twice
    schema.index({class_nbr: 1, term: 1, section: 1, mtg_start: 1, mtg_end: 1, pat: 1}, {unique: true});

    return mongoose.model('Class', schema);
};
