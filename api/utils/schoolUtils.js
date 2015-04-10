// schoolUtils.js
'use strict';

var _ = require('lodash');

var gradePoints = {
    'A+'    : 4.0,
    'A'     : 4.0,
    'A-'    : 3.7,
    'B+'    : 3.3,
    'B'     : 3.0,
    'B-'    : 2.7,
    'C+'    : 2.3,
    'C'     : 2.0,
    'C-'    : 1.7,
    'D+'    : 1.3,
    'D'     : 1.0,
    'D-'    : 0.7
};

var grades = _.invert(gradePoints);

function gradePointsFromGrade(grade) {
    return gradePoints[grade] || 0;
}

function gradeFromGradePoints(gradePoints) {
    return grades[gradePoints] || '';
}

// Turns '2153' into 'Spring 2015'
function termDescriptionFromCode(term) {
    var description = '';

    if (term.length === 4) {
        var season = term[3] === '3' ? 'Spring' : term[3] === 7 ? 'Fall' : '';
        var year = '20' + term.slice(1,3);

        description = season + ' ' + year;
    }

    return description;
}

// Turns 'Spring 2015' into '2153'
function termCodeFromDescription(term) {
    var parts = term.split(' ');
    return '2' + parts[1].slice(-2) + (parts[0] === 'Spring' ? '3' : parts[0] === 'Fall' ? '7' : '');
}

module.exports = {
    gradeFromGradePoints    : gradeFromGradePoints,
    gradePointsFromGrade    : gradePointsFromGrade,
    termDescriptionFromCode : termDescriptionFromCode,
    termCodeFromDescription : termCodeFromDescription
};
