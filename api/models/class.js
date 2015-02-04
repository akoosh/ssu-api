// class.js

module.exports = function(mongoose) {
    'use strict';

    var ObjectId = mongoose.Schema.Types.ObjectId;
    var schema = new mongoose.Schema({
        number: { type: String, required: true },
        term: { type: String, required: true },
        course: { type: ObjectId, required: true },
        instructor: { type: ObjectId, required: true },
        section: { type: String, required: true },
        component: { type: String, required: true },
        facilityId: { type: String, required: true },
        pattern: { type: String, required: true },
        mtgStart: { type: String, required: true },
        mtgEnd: { type: String, required: true },
    });

    // Cannot have the same class number within the same semester
    schema.index({number: 1, term: 1}, {unique: true});

    // Cannot have two classes of the same course with the same section
    // number in one semester
    schema.index({term: 1, course: 1, section: 1}, {unique: true});

    return mongoose.model('Class', schema);
};
