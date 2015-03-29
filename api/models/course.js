// course.js
'use strict';

module.exports = function(mongoose, plugins) {

    var schema = new mongoose.Schema({
        subject: { type: String, required: true },
        catalog: { type: String, required: true },
        class_description: { type: String, required: false }, // These two fields are the same thing but
        long_title: { type: String, required: false},         // named differently in different files.
        class_type: { type: String, required: false },
        class_units: { type: String, required: false },       // class_units should get moved to the Class entity
        min_units: { type: String, required: false },
        max_units: { type: String, required: false },
        career: { type: String, required: false }
    });

    // Enforce uniqueness of subject-catalog combinations, i.e. 'CS 242'
    schema.index({subject: 1, catalog: 1}, {unique: true});

    plugins.forEach(function(plugin) {
        schema.plugin(plugin);
    });

    return mongoose.model('Course', schema);
};
