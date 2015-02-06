// csvParser.js

module.exports.parse = function(data, callback) {
    'use strict';

    callback = (typeof callback === 'function') ? callback : function() {};

    // Should be 33 fields
    var fieldNames = [
        'ferpa',
        'student_id',
        'last_name',
        'first_name',
        'acad_plan',
        'acad_plan_descr',
        'term',
        'term_description',
        'career',
        'class_nbr',
        'subject',
        'catalog1',
        'section1',
        'class_description',
        'component',
        'class_type',
        'designation',
        'academic_level',
        'term_units',
        'class_units',
        'reason',
        'add_date',
        'grade',
        'gender',
        'ethnic_grp',
        'facility_id',
        'mtg_start',
        'mtg_end',
        'mtg_pattern',
        'instructor_id',
        'instructor_name',
        'advisor_id',
        'advisor_name'
    ];

    var numFields = fieldNames.length;
    var rows = [];

    // We need to trim the data to ensure the correct number of lines
    data.trim().split('\n').forEach(function(line, i) {

        var row = {};

        // The replace() calls are to ensure escaped commas (\,) do not delimit fields
        line.replace(/,/g, '\\,').replace(/\\\\,/g, ',').split(/\\,/).forEach(function(field, j) {
            if (j < numFields) {
                row[fieldNames[j]] = field;
            } else {
                callback("Error: Row " + i + " has too many fields.");
                return;
            }
        });

        if (Object.keys(row).length === numFields) {
            rows.push(row);
        } else {
            callback("Error: Row " + i + " has too few fields.");
            return;
        }
    });

    callback(null, rows);
};
