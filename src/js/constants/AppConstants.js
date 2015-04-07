var keyMirror = require('react/lib/keyMirror');

// Define action constants
module.exports = keyMirror({
    RECEIVE_STUDENTS: null,
    RECEIVE_INSTRUCTORS: null,
    RECEIVE_ADVISORS: null,
    RECEIVE_COURSES: null,

    RECEIVE_STUDENT_DATA: null,
    RECEIVE_INSTRUCTOR_DATA: null,
    RECEIVE_ADVISOR_DATA: null,
    RECEIVE_COURSE_DATA: null,
    RECEIVE_SECTION_DATA: null
});
