'use strict';

angular
  .module('accreditationApp', [
    'ngCookies',
    'restangular',
    'ngSanitize',
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate'
  ])
  .config(['$translateProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', 'REST_BASE_URL',
           function ($translateProvider, $stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, REST_BASE_URL) {

$urlRouterProvider.otherwise('/');

  $translateProvider.useStaticFilesLoader({
    prefix: 'languages/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('en');
  $translateProvider.fallbackLanguage('en');
  $translateProvider.useLocalStorage();
  $translateProvider.useSanitizeValueStrategy('sanitize');
  
  RestangularProvider.setBaseUrl(REST_BASE_URL);

  $stateProvider

    .state('index', {
      url: '/',
      templateUrl: 'views/event_list.html',
      controller: 'EventListCtrl'
    })
   ;


}])
.run(['$rootScope', '$state', '$stateParams', '$window', 'Restangular', 'auth', 'user', 'API_AUTH_CODE',
      function($rootScope, $state, $stateParams, $window, Restangular, auth, user, API_AUTH_CODE){
	$rootScope.available_languages = {"en":"English"};
	
	if (!auth.loggedIn )//|| (!user.hasPermission(API_AUTH_CODE, 'Admin') && !user.hasPermission(API_AUTH_CODE, 'CreateResource')))
	{
		$window.location.href = auth.loginUrl;
	}
	
  
	Restangular.setErrorInterceptor(
	function(response)
	{
		
		// if the user is not authorised to perform the action, redirect to login
		if (response.status == 401 || response.status == 403)
		{
			$window.location.href = auth.loginUrl;
		}
	}
  );
}]);
