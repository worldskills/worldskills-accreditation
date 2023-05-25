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
    'ngFileUpload',
    'worldskills.utils'
  ])
    .constant('API_ACCREDITATION_CODE', 2100)
    .config(['$controllerProvider', '$routeProvider', '$translateProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', 'RestangularProvider', 'REST_BASE_URL', 'API_ORG',
             function ($controllerProvider, $routeProvider, $translateProvider, $stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider, REST_BASE_URL, API_ORG) {
    
    $controllerProvider.allowGlobals();
    	
    //$urlRouterProvider.otherwise('/');
    $urlRouterProvider.otherwise(function ($injector, $location) {
    	// check for existing redirect
        var $state = $injector.get('$state');
        var redirectToState = sessionStorage.getItem('redirect_to_state');
        var redirectToParams = sessionStorage.getItem('redirect_to_params');
        sessionStorage.removeItem('redirect_to_state');
        sessionStorage.removeItem('redirect_to_params');
        if (redirectToState) {
            if (redirectToParams) {
                redirectToParams = angular.fromJson(redirectToParams);
            } else {
                redirectToParams = {};
            }
            $state.go(redirectToState, redirectToParams);
        } else {
            $state.go('main.event_list');
        }
    });

    /*$routeProvider
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
      });*/

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

    .state('main', {
      abstract: true,
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .state('main.event_list', {
    	url: '/events',
    	templateUrl: 'views/event_list.html',
    	controller: 'EventListCtrl',
    	data: {
            requireLoggedIn: true
        }
    })
    .state('main.event', {
        url: '/events/{eventId}',
        templateUrl: 'views/event.html',
        controller: 'EventCtrl',
        abstract: true
    })
    .state('main.event.people', {
    	url: '/people',
    	templateUrl: 'views/people.html',
    	controller: 'PeopleListCtrl',
    	data: {
            requireLoggedIn: true
        }
    })
    .state('main.person', {
    	url: '/events/{eventId}/people/{accreditationId}',
    	templateUrl: 'views/person.html',
    	controller: 'PersonCtrl',
    	data: {
            requireLoggedIn: true
        }
    })
    .state('print', {
    	url: '/events/{eventId}/print/?adHoc&accreditationId&name&position&member&skill&printed&photo&delegateTypes&group&zone',
    	templateUrl: 'views/print.html',
    	controller: 'PrintCtrl',
    	data: {
            requireLoggedIn: true
        }
    })
    .state('main.event.zone_list', {
        url: '/zones',
        templateUrl: 'views/zone_list.html',
        controller: 'ZoneListCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('main.zone', {
        url: '/events/{eventId}/zones/{id}',
        templateUrl: 'views/zone.html',
        controller: 'ZoneCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('main.event.delegate_type_list', {
        url: '/delegate_types',
        templateUrl: 'views/delegate_type_list.html',
        controller: 'DelegateTypeListCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('main.delegate_type', {
        url: '/events/{eventId}/delegate_types/{id}',
        templateUrl: 'views/delegate_type.html',
        controller: 'DelegateTypeCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('main.event.positions', {
        url: '/positions',
        templateUrl: 'views/positions.html',
        controller: 'PositionsCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('main.event.package_option_list', {
        url: '/package_options',
        templateUrl: 'views/package_option_list.html',
        controller: 'PackageOptionListCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('main.event.package_option', {
        url: '/package_options/{id}',
        templateUrl: 'views/package_option.html',
        controller: 'PackageOptionCtrl',
        data: {
            requireLoggedIn: true
        }
    })
    .state('main.event.export', {
        url: '/export',
        templateUrl: 'views/export.html',
        controller: 'ExportCtrl',
        data: {
            requireLoggedIn: true
        }
    })
   ;

  }])
  // set up a restangular object for the org service
  .factory('OrgRestangular', function(Restangular, API_ORG) {
	  return Restangular.withConfig(function(RestangularConfigurer) {
		  RestangularConfigurer.setBaseUrl(API_ORG);
	  });
  })
  .run(['$rootScope', '$state', '$stateParams', '$window', 'Restangular', 'auth', 'user',
        function($rootScope, $state, $stateParams, $window, Restangular, auth, user){
	
	  $rootScope.available_languages = {'en': 'English', 'de': 'Deutsch', 'fr': 'Français', 'it': 'Italiano'};
	
	  if (!auth.loggedIn )
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
}]);
