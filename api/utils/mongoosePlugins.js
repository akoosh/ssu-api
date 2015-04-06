// mongoosePlugins.js
'use strict';

module.exports = [
    require('mongoose-deep-populate'),
    require('mongoose-hidden')({autoHideObject: false})
];
