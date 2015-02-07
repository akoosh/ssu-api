// multerOptions.js

module.exports = function() {
    'use strict';

    var options = {};

    options.dest = './api/uploads';

    options.rename = function (fieldname, filename) {
        return [fieldname, filename, Date.now()].join('-');
    };

    options.onFileUploadComplete = function (file) {
        console.log('File uploaded: ' + file.path);
    };

    options.onError = function (error, next) {
        console.log(error);
        next(error);
    };

    return options;
}();
