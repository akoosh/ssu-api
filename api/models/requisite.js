// requisite.js
'use strict';

module.exports = function(mongoose, plugins) {

    var ObjectId = mongoose.Schema.Types.ObjectId;
    var schema = new mongoose.Schema({
        course: { type: ObjectId, ref: 'Course', required: true },
        requisite: { type: ObjectId, ref: 'Course', required: true },
        type: { type: String, required: true },
        grade: { type: String, required: false }
    });

    // Cannot have the same requisite twice
    schema.index({course: 1, requisite: 1}, {unique: true});

    plugins.forEach(function(plugin) {
        schema.plugin(plugin);
    });

    return mongoose.model('Requisite', schema);
};
