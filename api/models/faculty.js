// facutly.js
'use strict';

module.exports = function(mongoose, plugins) {

    var schema = new mongoose.Schema({
        faculty_id: { type: String, required: true, index: {unique: true } },
        last_name: { type: String, required: true },
        first_name: { type: String, required: false }
    });

    plugins.forEach(function(plugin) {
        schema.plugin(plugin);
    });

    return mongoose.model('Faculty', schema);
};
