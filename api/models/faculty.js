// facutly.js

module.exports = function(mongoose) {
    'use strict';

    return mongoose.model('Faculty', new mongoose.Schema({
        fid: { type: String, required: true, unique: true, index: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    }));
};
