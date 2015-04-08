// multerOptions.js
'use strict';

module.exports = {

    dest : './api/uploads',

    rename : function (fieldname, filename) {
        return [fieldname, filename, Date.now()].join('-');
    },

    onFileUploadComplete : function (file) {
        console.log('File uploaded: ' + file.path);
    },

    onError : function (error, next) {
        console.log(error);
        next(error);
    }
};
