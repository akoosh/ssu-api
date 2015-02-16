// loadData.js
'use strict';

function newFieldName(old) {
    return old.toLowerCase().replace(/ /g, '_');
}

function exractAndLoad(data, models, callback) {
    buildInstructor(data, models, {}, callback);
}

function buildInstructor(data, models, products, callback) {
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
                    callback(err);
                } else {
                    products.instructor = product;
                    buildAdvisor(data, models, products, callback);
                }
            });
        } else if (err) {
            callback(err);
        } else {
            products.instructor = product;
            buildAdvisor(data, models, products, callback);
        }
    });
}

function buildAdvisor(data, models, products, callback) {
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
                    callback(err);
                } else {
                    products.advisor = product;
                    buildStudent(data, models, products, callback);
                }
            });
        } else if (err) {
            callback(err);
        } else {
            products.advisor = product;
            buildStudent(data, models, products, callback);
        }
    });
}

function buildStudent(data, models, products, callback) {
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
                    callback(err);
                } else {
                    products.student = product;
                    buildCourse(data, models, products, callback);
                }
            });
        } else if (err) {
            callback(err);
        } else {
            products.student = product;
            buildCourse(data, models, products, callback);
        }
    });
}

function buildCourse(data, models, products, callback) {
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
                    callback(err);
                } else {
                    products.course = product;
                    buildClass(data, models, products, callback);
                }
            });
        } else if (err) {
            callback(err);
        } else {
            products.course = product;
            buildClass(data, models, products, callback);
        }
    });
}

function buildClass(data, models, products, callback) {
    // all required keys in Class should also be in data
    // except for course and instructor
    var classDoc = new models.Class();
    for (var key in models.Class.schema.paths) {
        if (key in data) {
            classDoc[key] = data[key];
        }
    }

    classDoc.course = products.course._id;
    classDoc.instructor = products.instructor._id;

    classDoc.save(function(err, product) {
        if (err && err.code === 11000) {
            // duplicate key
            var params = {
                class_nbr:  classDoc.class_nbr,
                term:       classDoc.term,
                section:    classDoc.section,
                mtg_start:  classDoc.mtg_start,
                mtg_end:    classDoc.mtg_end,
                pat:        classDoc.pat
            };

            models.Class.findOne(params, function(err, product) {
                if (err) {
                    callback(err);
                } else {
                    products.class = product;
                    buildEnrollment(data, models, products, callback);
                }
            });
        } else if (err) {
            console.log(products.course);
            console.log(err);
            callback(err);
        } else {
            products.class = product;
            buildEnrollment(data, models, products, callback);
        }
    });
}

function buildEnrollment(data, models, products, callback) {
    // all required keys in Enrollment should also be in data
    // except for student and class
    var enrollment = new models.Enrollment();
    for (var key in models.Enrollment.schema.paths) {
        if (key in data) {
            enrollment[key] = data[key];
        }
    }

    enrollment.student = products.student._id;
    enrollment.class = products.class._id;

    enrollment.save(function(err, product) {
        if (err && err.code === 11000) {
            // duplicate key
            var params = {
                student:    enrollment.student,
                class:      enrollment.class
            };

            models.Enrollment.findOne(params, function(err, product) {
                if (err) {
                    callback(err);
                } else {
                    products.enrollment = product;
                    buildAdvisement(data, models, products, callback);
                }
            });
        } else if (err) {
            callback(err);
        } else {
            products.enrollment = product;
            buildAdvisement(data, models, products, callback);
        }
    });
}

function buildAdvisement(data, models, products, callback) {
    // all required keys in Advisement should also be in data
    // except for student and class
    var advisement = new models.Advisement();
    for (var key in models.Advisement.schema.paths) {
        if (key in data) {
            advisement[key] = data[key];
        }
    }

    advisement.student = products.student._id;
    advisement.advisor = products.advisor._id;


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
                    callback(err);
                } else {
                    products.advisement = product;
                    callback(null, products);
                }
            });
        } else if (err) {
            callback(err);
        } else {
            products.advisement = product;
            callback(null, products);
        }
    });
}

module.exports = function(csvData, models, callback) {
    
    callback = (typeof callback === 'function') ? callback : function() {};

    var numRows = csvData.length;

    var successes = 0;
    var loadingError = false;
    var extractAndLoadCallback = function(err, products) {
        if (err && !loadingError) {
            loadingError = true;
            callback(err);
        } else if (err) {
            // an error has happened but it's not the first one
        } else {
            successes++;
            if (successes === numRows - 1) {
                callback(null);
            }
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

            exractAndLoad(rowData, models, extractAndLoadCallback);
        }
    }
};
