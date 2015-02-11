// facutly.js

module.exports = function(mongoose) {
    'use strict';

    return mongoose.model('Faculty', new mongoose.Schema({
        faculy_id: { type: String, required: true, unique: true, index: true },
        last_name: { type: String, required: true },
        first_name: { type: String, required: false }
    }));
};
