// course.js

module.exports = function(mongoose) {
    'use strict';

    var schema = new mongoose.Schema({
        subject: { type: String, required: true },
        catalog: { type: String, required: true },
        class_description: { type: String, required: true },
        class_type: { type: String, required: true },
        class_units: { type: Number, required: true },
        career: { type: String, required: true }
    });

    // Enforce uniqueness of subject-catalog combinations, i.e. 'CS 242'
    schema.index({subject: 1, catalog: 1}, {unique: true});

    schema.set('toJSON', {
        transform: function(doc, ret, options) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    return mongoose.model('Course', schema);
};
