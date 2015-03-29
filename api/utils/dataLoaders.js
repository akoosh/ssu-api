// dataLoaders.js
'use strict';

var _ = require('lodash');

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

    bulk.execute(function(err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};

exports.loadRequisites = function(courses, models, callback) {
    console.log('loading requisites...');
    callback(null);
};

module.exports = exports;
