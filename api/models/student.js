// student.js

module.exports = function(mongoose) {
    return mongoose.model('Student', new mongoose.Schema({
        sid: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        major: { type: String, enum: ['CS', 'MATH', 'CHEM', 'BIOL', 'ENGL'] },
        gpa: { type: Number, min: 0, max: 4 }
    }));
};
