// enrollment.js

module.exports = function(mongoose) {
    'use strict';

    var ObjectId = mongoose.Schema.Types.ObjectId;
    var schema = new mongoose.Schema({
        student: { type: ObjectId, required: true },
        class: { type: ObjectId, required: true },
        reason: { type: String, required: true },
        add_dt: { type: Date, required: true },
        grade: { type: String, required: false },
    });

    // A student cannot be enrolled in the same class twice
    schema.index({student: 1, class: 1}, {unique: true});

    return mongoose.model('Enrollment', schema);
};
