// loadData.js

function newFieldName(old) {
    return old.toLowerCase().replace(/ /g, '_');
}

module.exports = function(csvData, models, callback) {
    'use strict';
    
    callback = (typeof callback === 'function') ? callback : function() {};

    var numRows = csvData.length;

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
            var rowData = {};

            for (var fieldNum = 0; fieldNum < numFields; fieldNum++) {
                rowData[fieldNames[fieldNum]] = row[fieldNum];
            }
        }

        callback(null);
    }
};
