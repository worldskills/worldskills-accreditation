'use strict';

/**
 * @ngdoc overview
 * @name worldSkillsApp
 * @description
 * # worldSkillsApp
 *
 * Main module of the application.
 */
angular
  .module('accreditationApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'pascalprecht.translate',
    'restangular',
    'ui.select2'
  ])
    .config(function ($controllerProvider, $routeProvider, $translateProvider, $stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, REST_BASE_URL, API_ORG) {
    
    $controllerProvider.allowGlobals();
    	
    $urlRouterProvider.otherwise('/');

    $routeProvider
      .when('/', {
        templateUrl: 'views/event_list.html',
        controller: 'EventListCtrl'
      })
      //.when('/about', {
      //  templateUrl: 'views/about.html',
      //  controller: 'AboutCtrl'
      //})
      .otherwise({
        redirectTo: '/'
      });

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
    .state('event_list', {
    	url: '/events',
    	templateUrl: 'views/event_list.html',
    	controller: 'EventListCtrl'
    })
    .state('people', {
    	url: '/events/{event_id}/people',
    	templateUrl: 'views/people.html',
    	controller: 'PeopleListCtrl'
    })
   ;

  })
  // set up a restangular object for the org service
  .factory('OrgRestangular', function(Restangular, API_ORG) {
	  return Restangular.withConfig(function(RestangularConfigurer) {
		  RestangularConfigurer.setBaseUrl(API_ORG);
	  });
  })
  .run(function($rootScope, $state, $stateParams, $window, Restangular, auth, user, API_AUTH_CODE){
	
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

	  // It's very handy to add references to $state and $stateParams to the $rootScope
	  // so that you can access them from any scope within your applications.For example,
	  // <li ng-class='{ active: $state.includes('contacts.list') }'> will set the <li>
	  // to active whenever 'contacts.list' or one of its decendents is active.
	  $rootScope.$state = $state;
	  $rootScope.$stateParams = $stateParams;
});
