var AppApi        = require('../utils/AppApi');

var AppActions = {};

AppActions.getData = function(type) {
    switch(type) {
        case 'students':
            AppApi.getStudents();
            break;
        case 'instructors':
            AppApi.getInstructors();
            break;
        case 'advisors':
            AppApi.getAdvisors();
            break;
        case 'courses':
            AppApi.getCourses();
            break;
        default:
            break;
    }
};

module.exports = AppActions;
