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
    callback = (typeof callback === 'function') ? callback : function() {};

    // Get course for subject : catalog_number
    db.getCourseBySubjectAndCatalogNumber(subject, catalog_number, objectHandler(callback, function(course) {

        // Get the req. for the given subject : catalog_number
        models.Requisite.find( { course : course._id }, arrayHandler(callback, function(requisites) {

            var eligibleStudentIdGetters = requisites.filter(prerequisiteFilter).map(eligibleStudentIdGetterForPrerequisiteByTerm(term));

            Async.parallel({
                // all students that are currently enrolled in the prerequisites or have completed them before the given semester
                eligibleStudentIds: function(callback) {
                    Async.parallel( eligibleStudentIdGetters, arrayHandler(callback, function(results) {
                        // Produces all of the studentIds who are eligible to take the course
                        var elgStudents = _.spread( _.intersection)(results);
                        callback(null, elgStudents);
                    }));
                },

                // all students that have already passed the course before given semester or are currently enrolled in it
                doneStudentIds: function(callback) {
                    models.Section.find( { course : course._id, term : { $lte : term } }, arrayHandler(callback, function(sections) {
                        var sectionIds = _.pluck( sections, '_id' );

                        // Find all students that have taken one of those sections
                        models.Enrollment.find( { section : { $in : sectionIds } }).populate('section').exec(arrayHandler(callback, function(enrollments){
                            // Filter out failing grades unless they are from the current semester
                            var valid = enrollments.filter(function(enrollment) {
                                if (enrollment.section.term === term) {
                                    return true;
                                } else {
                                    return utils.gradePointsFromGrade(enrollment.grade) >= utils.gradePointsFromGrade('C-');
                                }
                            });

                            var studentIds = _.uniq( _.pluck( valid, 'student' ).map(String) );
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

// This is a factory function that produces a function intended to be used with [].map().
function eligibleStudentIdGetterForPrerequisiteByTerm(term) {
    // This is the map function that returns a function that will get the ObjectIds of all students who have
    // fullfilled the prerequisite before the given semester.
    return function(prerequisite) {
        return function(callback) {
            // Find all section sections that are instances of the prerequisite
            models.Section.find( { course : prerequisite.requisite, term : { $lte : term } }, arrayHandler(callback, function(sections) {
                var sectionIds = _.pluck( sections, '_id' );

                // Find all students that have taken one of those sections
                models.Enrollment.find( { section : { $in : sectionIds } }).populate('section').exec(arrayHandler(callback, function(enrollments){
                    // Filter out failing grades unless they are in the current semester
                    var valid = enrollments.filter(function(enrollment) {
                        if (enrollment.section.term === term) {
                            return true;
                        } else {
                            return utils.gradePointsFromGrade(enrollment.grade) >= utils.gradePointsFromGrade(prerequisite.grade);
                        }
                    });

                    var studentIds = _.uniq( _.pluck( valid, 'student' ).map(String) );
                    callback( null, studentIds );
                }));
            }));
        };
    };
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
    getEligibleStudentsBySubjectCatalogNumberAndTerm:   getEligibleStudentsBySubjectCatalogNumberAndTerm,
    getEligibleStudentsBySubjectAndCatalogNumber:       getEligibleStudentsBySubjectAndCatalogNumber
};
