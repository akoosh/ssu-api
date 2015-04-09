// database.js
'use strict';

var mongoose    = require('mongoose');
var _           = require('lodash');
var fs          = require('fs');
var Async       = require('async');
var parse       = require('csv-parse');
var Schemas     = require('./utils/dataFileSchemas');
var Loaders     = require('./utils/dataLoaders');
var models      = require('./models');

// Enable this to see mongoose activity
// mongoose.set('debug', true);

// This is a callback factory for callbacks that expect an array of results.
// The success function is only called if the data is good.
function arrayHandler(failure, success) {
    return function(err, array) {
        if (err) {
            failure(err);
        } else if (!array.length) {
            failure(204);
        } else {
            success(array);
        }
    };
}

// This is a callback factory for callbacks that expect a single result object.
// The success function is only called if the data is good.
function objectHandler(failure, success) {
    return function(err, object) {
        if (err) {
            failure(err);
        } else if (!object) {
            failure(404);
        } else {
            success(object);
        }
    };
}

// Student functions

function getAllStudents(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Student.find(arrayHandler(callback, function(students) {
        callback(null, students);
    }));
}

function getStudentById(student_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Student.findOne({student_id: student_id}, objectHandler(callback, function(student) {
        callback(null, student);
    }));
}

function getAdvisorsByStudentId(student_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getStudentById(student_id, objectHandler(callback, function(student) {
        models.Advisement.find({student: student._id}).populate('advisor').exec(arrayHandler(callback, function(advisements) {
            advisements.forEach(function(advisement) { advisement.student = undefined; });
            callback(null, advisements);
        }));
    }));
}

function getSectionsByStudentId(student_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getStudentById(student_id, objectHandler(callback, function(student) {
        models.Enrollment.find({student: student._id}).deepPopulate('section section.instructor section.course').exec(arrayHandler(callback, function(enrollments) {
            enrollments.forEach(function(enrollment) { enrollment.student = undefined; });
            callback(null, enrollments);
        }));
    }));
}


// Instructor functions

function getAllInstructors(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Faculty.find(arrayHandler(callback, function(instructors) {
        callback(null, instructors);
    }));
}

function getInstructorById(instructor_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Faculty.findOne({faculty_id: instructor_id}, objectHandler(callback, function(instructor) {
        callback(null, instructor);
    }));
}

function getSectionsByInstructorId(instructor_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getInstructorById(instructor_id, objectHandler(callback, function(instructor) {
        models.Section.find({instructor: instructor._id}).populate('course').exec(arrayHandler(callback, function(sections) {
            sections.forEach(function(c) { c.instructor = undefined; });
            callback(null, sections);
        }));
    }));
}


// Advisor functions

function getAllAdvisorIds(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Advisement.distinct('advisor', arrayHandler(callback, function(advisor_ids) {
        callback(null, advisor_ids);
    }));
}

function getAllAdvisors(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getAllAdvisorIds(arrayHandler(callback, function(advisor_ids) {
        models.Faculty.find({_id: {$in: advisor_ids}}, arrayHandler(callback, function(advisors) {
            callback(null, advisors);
        }));
    }));
}

function getAdvisorById(advisor_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getAllAdvisorIds(arrayHandler(callback, function(advisor_ids) {
        models.Faculty.findOne({_id: {$in: advisor_ids}, faculty_id: advisor_id}, objectHandler(callback, function(advisor) {
            callback(null, advisor);
        }));
    }));
}

function getStudentsByAdvisorId(advisor_id, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getAdvisorById(advisor_id, objectHandler(callback, function(advisor) {
        models.Advisement.find({advisor: advisor._id}).populate('student').exec(arrayHandler(callback, function(advisements) {
            advisements.forEach(function(advisement) { advisement.advisor = undefined; });
            callback(null, advisements);
        }));
    }));
}


// Course routes

function getAllCourses(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Course.find(arrayHandler(callback, function(courses) {
        callback(null, courses);
    }));
}

function getAllSubjects(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Course.distinct('subject', arrayHandler(callback, function(subjects) {
        callback(null, subjects);
    }));
}

function getCoursesBySubject(subject, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Course.find({subject: subject.toUpperCase()}, arrayHandler(callback, function(courses) {
        callback(null, courses);
    }));
}

function getCourseBySubjectAndCatalogNumber(subject, catalog_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Course.findOne({subject: subject.toUpperCase(), catalog: catalog_number}, objectHandler(callback, function(course) {
        callback(null, course);
    }));
}

function getSectionsBySubjectAndCatalogNumber(subject, catalog_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getCourseBySubjectAndCatalogNumber(subject, catalog_number, objectHandler(callback, function(course) {
        models.Section.find({course: course._id}).populate('course instructor').exec(arrayHandler(callback, function(sections) {
            sections.forEach(function(section) { section.course = undefined; });
            callback(null, sections);
        }));
    }));
}


// Section functions

function getAllSections(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Section.find(arrayHandler(callback, function(sections) {
        callback(null, sections);
    }));
}

function getAllTerms(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Section.distinct('term', arrayHandler(callback, function(terms) {
        callback(null, terms);
    }));
}

function getAllSectionsByTerm(term, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Section.find({term: term}).populate('course instructor').exec(arrayHandler(callback, function(sections) {
        callback(null, sections);
    }));
}

function getSectionByTermAndClassNumber(term, class_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Section.findOne({term: term, class_nbr: class_number}).populate('course instructor').exec(objectHandler(callback, function(section) {
        callback(null, section);
    }));
}

function getAllStudentsInSectionByTermAndClassNumber(term, class_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getSectionByTermAndClassNumber(term, class_number, objectHandler(callback, function(section) {
        models.Enrollment.find({section: section._id}).populate('student').exec(arrayHandler(callback, function(enrollments) {
            enrollments.forEach(function(enrollment) { enrollment.section = undefined; });
            callback(null, enrollments);
        }));
    }));
}


// Requisite functions

function getAllRequisites(callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    models.Requisite.find().populate('course requisite').exec(arrayHandler(callback, function(requisites) {
        callback(null, requisites);
    }));
}

function getRequisitesBySubjectAndCatalogNumber(subject, catalog_number, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    getCourseBySubjectAndCatalogNumber(subject, catalog_number, objectHandler(callback, function(course) {
        models.Requisite.find({course: course._id}).populate('requisite').exec(arrayHandler(callback, function(requisites) {
            requisites.forEach(function(requisite) { requisite.course = undefined; });
            callback(null, requisites);
        }));
    }));
}


// Data loading functions

function processFileWithSchema(schemaName, filepath, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    fs.readFile(filepath, 'utf8', function(err, data) {
        if (err) {
            callback(err);
        } else {
            var conformsToSchema = false;
            var columnNames = function(columns) {
                var transformedColumns = columns.map(Schemas.transformField);
                conformsToSchema = Schemas.conformsToSchema(schemaName, transformedColumns);

                return transformedColumns.map(Schemas.keyForFieldName);
            };

            parse(data, {columns: columnNames, trim: true}, function(err, data) {
                if (err) {
                    callback(err);
                } else if (!conformsToSchema) {
                    callback('Invalid fields: Expected: ' + Schemas[schemaName]);
                } else {
                    Loaders.loaderForSchema[schemaName](data, models, callback);
                }
            });
        }
    });
}

module.exports = {
    arrayHandler                                    : arrayHandler,
    objectHandler                                   : objectHandler,

    getAllStudents                                  : getAllStudents,
    getStudentById                                  : getStudentById,
    getAdvisorsByStudentId                          : getAdvisorsByStudentId,
    getSectionsByStudentId                          : getSectionsByStudentId,

    getAllInstructors                               : getAllInstructors,
    getInstructorById                               : getInstructorById,
    getSectionsByInstructorId                       : getSectionsByInstructorId,

    getAllAdvisors                                  : getAllAdvisors,
    getAdvisorById                                  : getAdvisorById,
    getStudentsByAdvisorId                          : getStudentsByAdvisorId,

    getAllCourses                                   : getAllCourses,
    getAllSubjects                                  : getAllSubjects,
    getCoursesBySubject                             : getCoursesBySubject,
    getCourseBySubjectAndCatalogNumber              : getCourseBySubjectAndCatalogNumber,
    getSectionsBySubjectAndCatalogNumber            : getSectionsBySubjectAndCatalogNumber,

    getAllSections                                  : getAllSections,
    getAllTerms                                     : getAllTerms,
    getAllSectionsByTerm                            : getAllSectionsByTerm,
    getSectionByTermAndClassNumber                  : getSectionByTermAndClassNumber,
    getAllStudentsInSectionByTermAndClassNumber     : getAllStudentsInSectionByTermAndClassNumber,

    getAllRequisites                                : getAllRequisites,
    getRequisitesBySubjectAndCatalogNumber          : getRequisitesBySubjectAndCatalogNumber,

    processFileWithSchema                           : processFileWithSchema
};
