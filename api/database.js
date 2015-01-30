// database.js

module.exports = function(mongoose) {
    mongoose.connect('mongodb://localhost/students');

    return {
        Student: require('./models/student')(mongoose)
    }
};
