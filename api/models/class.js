// class.js

module.exports = function(mongoose) {
    'use strict';

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
        facil_id: { type: String, required: false },
        mtg_start: { type: String, required: true },
        mtg_end: { type: String, required: true },
        pat: { type: String, required: true }
    });

    // Cannot have the same class twice
    schema.index({class_nbr: 1, term: 1, section: 1, mtg_start: 1, mtg_end: 1, pat: 1}, {unique: true});

    schema.set('toJSON', {
        transform: function(doc, ret, options) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    return mongoose.model('Class', schema);
};
