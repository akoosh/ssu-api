// course.js

module.exports = function(mongoose) {
    'use strict';

    var schema = new mongoose.Schema({
        subject: { type: String, required: true },
        catalog: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, required: true },
        units: { type: Number, required: true }
    });

    // Enforce uniqueness of subject-catalog combinations, i.e. 'CS 242'
    schema.index({subject: 1, catalog: 1}, {unique: true});

    return mongoose.model('Course', schema);
};
