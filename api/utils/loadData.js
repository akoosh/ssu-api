// loadData.js
'use strict';

var Promise = require('promise');

function allWithObj(promises) {
    var accumulator = {};
    var ready = Promise.resolve(null);

    Object.keys(promises).forEach(function (promise) {
        ready = ready.then(function () {
            return promises[promise];
        }).then(function (value) {
            accumulator[promise] = value;
        });
    });

    return ready.then(function () { return accumulator; });
}

function arrayContainsObject(arr, obj) {
    for (var i = 0; i < arr.length; i++) {

        var equal = true;

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] !== arr[i][key]) {
                    equal = false;
                }
            }
        }

        if (equal) {
            return true;
        }
    }

    return false;
}

function newFieldName(old) {
    return old.toLowerCase().replace(/ /g, '_');
}

function exractAndLoad(data, models) {
    return new Promise(function(fullfill, reject) {
        allWithObj({
            instructorId:   buildInstructor(data, models),
            advisorId:      buildAdvisor(data, models),
            studentId:      buildStudent(data, models),
            courseId:       buildCourse(data, models)
        }).then(function(firstProducts) {
            allWithObj({
                classId:        buildClass(data, models, firstProducts.courseId, firstProducts.instructorId),
                advisementId:   buildAdvisement(data, models, firstProducts.studentId, firstProducts.advisorId)
            }).then(function(secondProducts) {
                buildEnrollment(data, models, firstProducts.studentId, secondProducts.classId).done(function() {
                    fullfill();
                }, function(err) {
                    reject(err);
                });
            }, function(err) {
                reject(err);
            });
        }, function(err) {
            reject(err);
        });
    });
}

function buildInstructor(data, models) {
    return new Promise(function(fullfill, reject) {
        var instructorName = data.instructor_name.split(/,/);
        var instructor = new models.Faculty({
            faculty_id: data.instructor_id,
            last_name: instructorName[0],
            first_name: instructorName.length > 1 ? instructorName[1] : null
        });

        instructor.save(function(err, product) {
            if (err && err.code === 11000) {
                // duplicate key
                models.Faculty.findOne({faculty_id: instructor.faculty_id}, function(err, product) {
                    if (err) {
                        reject(err);
                    } else {
                        fullfill(product._id);
                    }
                });
            } else if (err) {
                reject(err);
            } else {
                fullfill(product._id);
            }
        });
    });
}

function buildAdvisor(data, models) {
    return new Promise(function(fullfill, reject) {
        var advisorName = data.advisor_name.split(/,/);
        var advisor = new models.Faculty({
            faculty_id: data.advisor_id,
            last_name: advisorName[0],
            first_name: advisorName.length > 1 ? advisorName[1] : null
        });

        advisor.save(function(err, product) {
            if (err && err.code === 11000) {
                // duplicate key
                models.Faculty.findOne({faculty_id: advisor.faculty_id}, function(err, product) {
                    if (err) {
                        reject(err);
                    } else {
                        fullfill(product._id);
                    }
                });
            } else if (err) {
                reject(err);
            } else {
                fullfill(product._id);
            }
        });
    });
}

function buildStudent(data, models) {
    return new Promise(function(fullfill, reject) {
        // all required keys in Student should also be in data
        var student = new models.Student();
        for (var key in models.Student.schema.paths) {
            if (key in data) {
                student[key] = data[key];
            }
        }

        student.save(function(err, product) {
            if (err && err.code === 11000) {
                // duplicate key
                models.Student.findOne({student_id: student.student_id}, function(err, product) {
                    if (err) {
                        reject(err);
                    } else {
                        fullfill(product._id);
                    }
                });
            } else if (err) {
                reject(err);
            } else {
                fullfill(product._id);
            }
        });
    });
}

function buildCourse(data, models) {
    return new Promise(function(fullfill, reject) {
        // all required keys in Course should also be in data
        var course = new models.Course();
        for (var key in models.Course.schema.paths) {
            if (key in data) {
                course[key] = data[key];
            }
        }

        course.save(function(err, product) {
            if (err && err.code === 11000) {
                // duplicate key
                models.Course.findOne({subject: course.subject, catalog: course.catalog}, function(err, product) {
                    if (err) {
                        reject(err);
                    } else {
                        fullfill(product._id);
                    }
                });
            } else if (err) {
                reject(err);
            } else {
                fullfill(product._id);
            }
        });
    });
}

function buildClass(data, models, courseId, instructorId) {
    return new Promise(function(fullfill, reject) {
        // all required keys in Class should also be in data
        // except for course, instructor, and meetings
        var classDoc = new models.Class();
        for (var key in models.Class.schema.paths) {
            if (key in data) {
                classDoc[key] = data[key];
            }
        }

        classDoc.course = courseId;
        classDoc.instructor = instructorId;

        var meeting = {
            facil_id: data.facil_id,
            mtg_start: data.mtg_start,
            mtg_end: data.mtg_end,
            pat: data.pat
        };

        classDoc.meetings = [meeting];

        classDoc.save(function(err, product) {
            if (err && err.code === 11000) {
                // duplicate key
                var params = {
                    class_nbr:  classDoc.class_nbr,
                    term:       classDoc.term
                };

                models.Class.findOne(params, function(err, product) {
                    if (err) {
                        reject(err);
                    } else {
                        if (!arrayContainsObject(product.meetings, meeting)) {
                            product.meetings.push(meeting);
                            product.save(function(err, product) {
                                if (err) {
                                    reject(err);
                                } else {
                                    fullfill(product._id);
                                }
                            });
                        } else {
                            fullfill(product._id);
                        }
                    }
                });
            } else if (err) {
                reject(err);
            } else {
                fullfill(product._id);
            }
        });
    });
}

function buildAdvisement(data, models, studentId, advisorId) {
    return new Promise(function(fullfill, reject) {
        // all required keys in Advisement should also be in data
        // except for student and class
        var advisement = new models.Advisement();
        for (var key in models.Advisement.schema.paths) {
            if (key in data) {
                advisement[key] = data[key];
            }
        }

        advisement.student = studentId;
        advisement.advisor = advisorId;

        advisement.save(function(err, product) {
            if (err && err.code === 11000) {
                // duplicate key
                var params = {
                    student:    advisement.student,
                    advisor:    advisement.advisor,
                    term:       advisement.term
                };

                models.Advisement.findOne(params, function(err, product) {
                    if (err) {
                        reject(err);
                    } else {
                        fullfill(product._id);
                    }
                });
            } else if (err) {
                reject(err);
            } else {
                fullfill(product._id);
            }
        });
    });
}

function buildEnrollment(data, models, studentId, classId) {
    return new Promise(function(fullfill, reject) {
        // all required keys in Enrollment should also be in data
        // except for student and class
        var enrollment = new models.Enrollment();
        for (var key in models.Enrollment.schema.paths) {
            if (key in data) {
                enrollment[key] = data[key];
            }
        }

        enrollment.student = studentId;
        enrollment.class = classId;

        enrollment.save(function(err, product) {
            if (err && err.code === 11000) {
                // duplicate key
                var params = {
                    student:    enrollment.student,
                    class:      enrollment.class
                };

                models.Enrollment.findOne(params, function(err, product) {
                    if (err) {
                        reject(err);
                    } else {
                        fullfill(product._id);
                    }
                });
            } else if (err) {
                reject(err);
            } else {
                fullfill(product._id);
            }
        });
    });
}

module.exports = function(csvData, models, callback) {
    
    callback = (typeof callback === 'function') ? callback : function() {};

    var numRows = csvData.length;

    var successes = 0;
    var success = function() {
        successes++;
        if (successes === (numRows - 1)) {
            callback(null);
        }
    };

    var done = false;
    var failure = function(err) {
        if (!done) {
            done = true;
            callback(err);
        }
    };

    if (numRows === 0) {
        callback('CSV Data is empty.');
    } else if (numRows === 1) {
        callback('CSV Data has no rows.');
    } else {
        // We have data
        var fieldNames = csvData[0].map(newFieldName);
        var numFields = fieldNames.length;

        for (var rowNum = 1; rowNum < numRows; rowNum++) {
            var row = csvData[rowNum];

            // build object for row data
            var rowData = {};
            for (var fieldNum = 0; fieldNum < numFields; fieldNum++) {
                rowData[fieldNames[fieldNum]] = row[fieldNum];
            }

            exractAndLoad(rowData, models).done(success, failure);
        }
    }
};

module.exports.loadCourses = function(csvData, models, callback) {
    var numRows = csvData.length;

    var successes = 0;
    var success = function() {
        successes++;
        if (successes === (numRows - 1)) {
            callback(null);
        }
    };

    var done = false;
    var failure = function(err) {
        if (!done) {
            done = true;
            callback(err);
        }
    };

    if (numRows === 0) {
        callback('CSV Data has no rows.');
    } else {

        for (var rowNum = 1; rowNum < numRows; rowNum++) {
            var row = csvData[rowNum];

            buildCourse(row, models).done(success, failure);
            // exractAndLoad(rowData, models).done(success, failure);
        }
    }

};
