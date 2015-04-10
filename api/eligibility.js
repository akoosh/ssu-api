// eligibility.js
'use strict';

var Async           = require('async');
var _               = require('lodash');
var utils           = require('./utils/schoolUtils');
var models          = require('./models');
var db              = require('./database');
var arrayHandler    = db.arrayHandler;
var objectHandler   = db.objectHandler;

function getEligibleStudentsBySubjectCatalogNumberAndTerm(subject, catalog_number, term, callback) {
}

function getEligibleStudentsBySubjectAndCatalogNumber(subject, catalog_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    // Get course for subject : catalog_number
    db.getCourseBySubjectAndCatalogNumber(subject, catalog_number, objectHandler(callback, function(course) {

        // Get the req. for the given subject : catalog_number
        models.Requisite.find( { course : course._id }, arrayHandler(callback, function(requisites) {

            var eligibleStudentIdGetters = requisites.filter(prerequisiteFilter).map(eligibleStudentIdGetterByPrerequisite);

            Async.parallel({
                // all students that have fullfilled prerequisites
                eligibleStudentIds: function(callback) {
                    Async.parallel( eligibleStudentIdGetters, arrayHandler(callback, function(results) {
                        // Produces all of the studentIds who are eligible to take the course
                        var elgStudents = _.spread( _.intersection)(results);
                        callback(null, elgStudents);
                    }));
                },

                // all students that have already passed the course
                doneStudentIds: function(callback) {
                    models.Section.find( { course : course._id }, arrayHandler(callback, function(sections) {
                        var sectionIds = _.pluck( sections, '_id' );

                        // Find all students that have taken one of those sections
                        models.Enrollment.find( { section : { $in : sectionIds } }, arrayHandler(callback, function(enrollments){
                            // Filter out failing grades
                            var passing = enrollments.filter(function(enrollment) {
                                return (utils.gradePointsFromGrade(enrollment.grade) || 0) >= utils.gradePointsFromGrade('C-');
                            });

                            var studentIds = _.uniq( _.pluck( passing, 'student' ).map(String) );
                            callback( null, studentIds );
                        }));
                    }));
                }

            }, objectHandler(callback, function(results) {
                // Produces the list of students that are eligible to take the course excluding those
                // that have already taken and passed it.
                var studentIds = _.difference(results.eligibleStudentIds.map(String), results.doneStudentIds.map(String));
                models.Student.find( { _id : { $in : studentIds } }, callback );
            }));
        }));
    }));
}

function prerequisiteFilter(requisite) {
    return requisite.type === 'P';
}

function eligibleStudentIdGetterByPrerequisite(prerequisite) {
    return function(callback) {
        // Find all section sections that are instances of the prerequisite
        models.Section.find( { course : prerequisite.requisite }, arrayHandler(callback, function(sections) {
            var sectionIds = _.pluck( sections, '_id' );

            // Find all students that have taken one of those sections
            models.Enrollment.find( { section : { $in : sectionIds } }, arrayHandler(callback, function(enrollments){
                // Filter out failing grades
                var passing = enrollments.filter(function(enrollment) {
                    return (utils.gradePointsFromGrade(enrollment.grade) || -1) >= (utils.gradePointsFromGrade(prerequisite.grade) || 0);
                });

                var studentIds = _.uniq( _.pluck( passing, 'student' ).map(String) );
                callback( null, studentIds );
            }));
        }));
    };
}

module.exports = {
    getEligibleStudentsBySubjectAndCatalogNumber: getEligibleStudentsBySubjectAndCatalogNumber
};
