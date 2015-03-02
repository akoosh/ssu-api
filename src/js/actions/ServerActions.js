var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants  = require('../constants/AppConstants');

var ServerActions = {};

ServerActions.receiveData = function(data, dataType) {
    AppDispatcher.handleAction({
        actionType: AppConstants.RECEIVE_DATA,
        data: data,
        dataType: dataType
    });
};

module.exports = ServerActions;
