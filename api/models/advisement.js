// advisement.js

module.exports = function(mongoose) {
    'use strict';

    var ObjectId = mongoose.Schema.Types.ObjectId;
    var schema = new mongoose.Schema({
        student: { type: ObjectId, required: true },
        advisor: { type: ObjectId, required: true },
        term: { type: String, required: true },
        department: { type: Date, required: true },
    });

    // A student cannot have the same advisor twice in the same term
    schema.index({student: 1, advisor: 1, term: 1}, {unique: true});

    return mongoose.model('Advisement', schema);
};
