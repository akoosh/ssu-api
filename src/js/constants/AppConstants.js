var keyMirror = require('react/lib/keyMirror');

// Define action constants
module.exports = keyMirror({
    RECEIVE_STUDENTS: null,
    RECEIVE_INSTRUCTORS: null,
    RECEIVE_ADVISORS: null,
    RECEIVE_COURSES: null,

    RECEIVE_STUDENT: null,
    RECEIVE_STUDENT_ADVISORS: null,
    RECEIVE_STUDENT_SECTIONS: null
});
