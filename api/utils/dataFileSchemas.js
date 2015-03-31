// dataFileSchemas.js
'use strict';

var _ = require('lodash');

// A lot of these fields are not actually necessary for processing the entities
// being extracted from the data file. These are the complete list of field
// names from the types of files we expect, however, so they will be set up like
// this for now.

var schemas = {
    courses: [
        'Acad Group',
        'Subject',
        'Catalog',
        'Long Title',
        'Course Descr',
        'Grading',
        'Min Units',
        'Max Units',
        'Eff Date'
    ],

    requisites: [
        'Subject',
        'Catalog',
        'Requisite Subject',
        'Requisite Catalog',
        'Type',
        'Grade'
    ],

    classes: [
        'Term',
        'Subject',
        'Catalog',
        'Section',
        'Class Nbr',
        'Comb Sect',
        'CS Number',
        'Component',
        'Min Units',
        'Max Units',
        'Auto Enrol',
        'Auto Enr 2',
        'Designation',
        'Descr',
        'Pat',
        'START TIME',
        'END TIME',
        'Req Rm Cap',
        'Cap Enrl',
        'Tot Enrl',
        'Avail Seats',
        'Wait Tot',
        'Facil ID',
        'Capacity',
        'Instructor ID',
        'Last',
        'First Name',
        'Instructor Empl Rcd#',
        'Work Load',
        'Auto Enrol',
        'Acad Group'
    ],

    enrollments: [
        'FERPA',
        'Student ID',
        'Last Name',
        'First Name',
        'Acad Plan',
        'Acad Plan Descr',
        'Term',
        'Term Description',
        'Career',
        'Class Nbr',
        'Subject',
        'Catalog',
        'Section',
        'Class Description',
        'Component',
        'Class Type',
        'Designation',
        'Academic Level',
        'Term Units',
        'Class Units',
        'Reason',
        'Add Dt',
        'Grade',
        'Gender',
        'Ethnic Grp',
        'Facil ID',
        'Mtg Start',
        'Mtg End',
        'Pat',
        'Instructor ID',
        'Instructor Name',
        'Advisor ID',
        'Advisor Name',
        'Auto Enrol',
        'Auto Enr 2',
        'Comb Sect'
    ]
};

schemas.conformsToSchema = function(schemaName, fields) {

    // If the size of the intersection of the list of schema field names and actual
    // field names is the same as the number of fields in the schema, then all fields
    // in the schema are also in the supplied list.

    var schema = schemas[schemaName];
    return schema.length === _.intersection(schema, fields).length;
};

module.exports = schemas;
