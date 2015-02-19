// facutly.js
'use strict';

module.exports = function(mongoose) {

    var schema = new mongoose.Schema({
        faculty_id: { type: String, required: true, index: {unique: true } },
        last_name: { type: String, required: true },
        first_name: { type: String, required: false }
    });

    schema.set('toJSON', {
        transform: function(doc, ret, options) {
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    });

    return mongoose.model('Faculty', schema);
};
