(function() {
    'use strict';

    var restBaseUrl = 'http://localhost:9991';
    var authBaseUrl = 'http://localhost:8088';
    var orgBaseUrl = 'https://api.worldskills.org';
    var loginApp = 'http://worldskillsdevauth.com';
    var peopleApp = 'http://people.worldskills.org';
    
    var wsApp = angular.module('accreditationApp'); 
    wsApp.constant('REST_BASE_URL', restBaseUrl);
    wsApp.constant('CLIENT_ID', 'a95703d1aa96');
    wsApp.constant('WORLDSKILLS_CLIENT_ID', 'a95703d1aa96');
    wsApp.constant('API_AUTH', authBaseUrl + '/auth');
    wsApp.constant('WORLDSKILLS_API_AUTH', authBaseUrl + '/auth');
    wsApp.constant('API_ORG', orgBaseUrl + '/org');
    wsApp.constant('AUTHORIZE_URL', loginApp + '/oauth/authorize');
    wsApp.constant('WORLDSKILLS_AUTHORIZE_URL', loginApp + '/oauth/authorize');
    wsApp.constant('LOGOUT_URL', loginApp + '/logout');
    wsApp.constant('API_AUTH_CODE', 2100);
    wsApp.constant('PEOPLE_APP', peopleApp);

})();
