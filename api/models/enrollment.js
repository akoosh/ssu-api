// enrollment.js
'use strict';

module.exports = function(mongoose, plugins) {

    var ObjectId = mongoose.Schema.Types.ObjectId;
    var schema = new mongoose.Schema({
        student: { type: ObjectId, ref: 'Student', required: true },
        class: { type: ObjectId, ref: 'Class', required: true },
        reason: { type: String, required: true },
        add_dt: { type: Date, required: true },
        grade: { type: String, required: false },
    });

    // A student cannot be enrolled in the same class twice
    schema.index({student: 1, class: 1}, {unique: true});

    plugins.forEach(function(plugin) {
        schema.plugin(plugin);
    });

    return mongoose.model('Enrollment', schema);
};
