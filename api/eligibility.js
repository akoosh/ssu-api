// eligibility.js
'use strict';

var Async           = require('async');
var _               = require('lodash');
var models          = require('./models');
var db              = require('./database');
var arrayHandler    = db.arrayHandler;
var objectHandler   = db.objectHandler;

// This is a stopgap solution. Grades should probably be stored as numbers.
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
    'D'     : 1.0
};

function getEligibleStudentsBySubjectAndCatalogNumber(subject, catalog_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    // Get course for subject : catalog_number
    models.Course.findOne({subject: subject.toUpperCase(), catalog: catalog_number}, function(err, course) {

        // Get the req. for the given subject : catalog_number
        models.Requisite.find( { course : course._id }, function(err, requisites) {
            var preRequisites = requisites.filter( function(requisite){ 
              return requisite.type === 'P';
            });

            var reqStudentIdGetters = preRequisites.map( function(prerequisite) {
                return function(preCallback) {
                    // Find all section sections that are instances of the prerequisite
                    models.Section.find( { course : prerequisite.requisite }, function(err, sections) {
                        var sectionIds = _.pluck( sections, '_id' );

                        // Find all students that have taken one of those sections
                        models.Enrollment.find( { section : { $in : sectionIds } }, function(err, enrollments){
                            // Filter out failing grades
                            var passing = enrollments.filter(function(enrollment) {
                                return (gradePoints[enrollment.grade] || 0) >= (gradePoints[prerequisite.grade] || 0);
                            });

                            var studentIds = _.uniq( _.pluck( passing, 'student' ).map(String) );
                            preCallback( null, studentIds );
                        });
                    });
                };
            });

            Async.parallel({
                // all students that have fullfilled prerequisites
                eligibleStudentIds: function(callback) {
                    Async.parallel( reqStudentIdGetters, function(err,results) {
                        // Produces all of the studentIds who are eligible to take the section
                        var elgStudents = _.spread( _.intersection)(results);
                        callback(null, elgStudents);
                    });
                },

                // all students that have already passed the course
                doneStudentIds: function(callback) {
                    models.Section.find( { course : course._id }, function(err, sections) {
                        var sectionIds = _.pluck( sections, '_id' );

                        // Find all students that have taken one of those sections
                        models.Enrollment.find( { section : { $in : sectionIds } }, function(err, enrollments){
                            // Filter out failing grades
                            var passing = enrollments.filter(function(enrollment) {
                                return (gradePoints[enrollment.grade] || 0) >= gradePoints['C-'];
                            });

                            var studentIds = _.uniq( _.pluck( passing, 'student' ).map(String) );
                            callback( null, studentIds );
                        });
                    });
                }

            }, function(err, results) {
                // Produces the list of students that are eligible to take the course excluding those
                // that have already taken and passed it.
                var studentIds = _.difference(results.eligibleStudentIds.map(String), results.doneStudentIds.map(String));
                models.Student.find( { _id : { $in : studentIds } }, callback );
            });

        });
    });
}

module.exports = {
    getEligibleStudentsBySubjectAndCatalogNumber: getEligibleStudentsBySubjectAndCatalogNumber
};
