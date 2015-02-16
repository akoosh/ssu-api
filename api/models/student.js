// student.js
'use strict';

module.exports = function(mongoose) {

    var schema = new mongoose.Schema({
        student_id: { type: String, required: true, index: {unique: true } },
        last_name: { type: String, required: true },
        first_name: { type: String, required: true },
        acad_plan: { type: String, required: true },
        acad_plan_descr: { type: String, required: true },
        // academic_level: { type: String, required: true },
        // term_units: { term: String, units: Number },
        gender: { type: String, required: true },
        ethnic_grp: { type: String, required: true }
    });

    schema.set('toJSON', {
        transform: function(doc, ret, options) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    return mongoose.model('Student', schema);
};
