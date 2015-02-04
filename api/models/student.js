// student.js

module.exports = function(mongoose) {
    'use strict';

    return mongoose.model('Student', new mongoose.Schema({
        sid: { type: String, required: true, unique: true, index: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        acadPlan: { type: String, required: true },
        acadLv: { type: String, required: true },
        termUnits: { term: String, units: Number },
        gender: String,
        ethnicGrp: String,
        advisor: { type: mongoose.Schema.Types.ObjectId, required: true }
    }));
};
