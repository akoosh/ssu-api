// dataLoaders.js
'use strict';

var Async = require('async');
var _     = require('lodash');

var exports = {};

exports.loadCourses = function(courses, models, callback) {

    var bulk = models.Course.collection.initializeOrderedBulkOp();
    var docs = courses.forEach(function(course) {
        // all required keys in Course should also be in data
        var doc = new models.Course();
        for (var key in models.Course.schema.paths) {
            if (key in course) {
                doc[key] = course[key];
            }
        }
        bulk.find({subject: doc.subject, catalog: doc.catalog}).upsert().updateOne(_.omit(doc.toObject(), '_id'));
    });

    bulk.execute(callback);
};

exports.loadRequisites = function(rows, models, callback) {

    var numRows = rows.length;
    var error = false;
    var bulk = models.Requisite.collection.initializeUnorderedBulkOp();

    rows.forEach(function(row, index) {
        Async.parallel({
            course: function(callback) {
                models.Course.findOne({subject: row.subject, catalog: row.catalog}, callback);
            },

            requisite: function(callback) {
                models.Course.findOne({subject: row.requisite_subject, catalog: row.requisite_catalog}, callback);
            }

        }, function(err, results) {
            if (err) {
                error = err;
            } else if (!results.course || !results.requisite) {
                error = 'At least one of the courses is not in the database.';
            } else {
                var doc = new models.Requisite({
                    course:     results.course._id,
                    requisite:   results.requisite._id,
                    type:       row.type,
                    grade:      row.grade
                });

                bulk.find({course: doc.course, requisite: doc.requisite}).upsert().updateOne(_.omit(doc.toObject(), '_id'));
            }

            // Only execute bulk operation if there have been no errors
            if (index === numRows - 1) {
                if (error) {
                    callback(error);
                } else {
                    bulk.execute(callback);
                }
            }
        });
    });
};

module.exports = exports;
