// student.js

module.exports = function(mongoose) {
    'use strict';

    return mongoose.model('Student', new mongoose.Schema({
        student_id: { type: String, required: true, unique: true, index: true },
        last_name: { type: String, required: true },
        first_name: { type: String, required: true },
        acad_plan: { type: String, required: true },
        acad_plan_descr: { type: String, required: true },
        // academic_level: { type: String, required: true },
        // term_units: { term: String, units: Number },
        gender: { type: String, required: true },
        ethnic_grp: { type: String, required: true }
    }));
};
