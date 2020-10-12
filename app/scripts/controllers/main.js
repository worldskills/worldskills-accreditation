'use strict';

angular.module('accreditationApp')
.controller('MainCtrl', function ($scope, $rootScope, $state, $translate, Language, auth, user, 
		API_AUTH_CODE, alert, Restangular, $http, OrgRestangular, 
		$uibModal, ENVIRONMENT_WARNING) {
    $scope.selectedLanguage = Language.selectedLanguage;

    $scope.environmentWarning = ENVIRONMENT_WARNING;

    $scope.auth = auth;
    $scope.user = user;

    $scope.date = new Date();

    $scope.API_AUTH_CODE = API_AUTH_CODE;
    
    $rootScope.currentPage = 1;
    $rootScope.currentPeoplePage = 1;
    $rootScope.filterTags = [];
    
    $rootScope.badgerVidId = 'XT8hE7_8BCY';

    auth.hasUserRole(API_AUTH_CODE, 'Admin').then(function (hasUserRole) {
        if (hasUserRole) {
            $scope.userIsAdmin = true;
        }
    });

    $rootScope.showBadger = function() {
	    $rootScope.badgerModal = $uibModal.open({
			  scope: $scope,
			  template: '<div style="padding: 5px;"><youtube-video video-id="badgerVidId"></youtube-video></div>',
			  size: 'lg'
		  });
	    $scope.$on('youtube.player.ready', function ($event, player) {
	        // play it again
	        player.playVideo();
	      });
    };
    
    $rootScope.closeBadger = function() {
    	if ($scope.badgerModal)
		  {
			  $scope.badgerModal.close();
		  }
    }
    
    $scope.logout = function (e) {
        auth.logout();
    };
    
    $scope.$on('$stateChangeStart', function () {
        alert.clear();
    });
    
    // handler for an error
    $rootScope.errorHandler = function(response)
    {
    	$scope.loading = false;
    	alert.error('Error: ' + ' ' + response.data.code + ': ' + response.data.user_msg);
    	document.body.scrollTop = document.documentElement.scrollTop = 0;
    };

    $rootScope.getCountries = function()
    {
    	OrgRestangular.one('countries').get().then( function(result)
    	{
    		$rootScope.countries = result.country_list;
    	}, $rootScope.errorHandler);
    };
	  
    $rootScope.getCountries();
    
    $rootScope.filter = {
			firstName: '',
			lastName: '',
			position: '',
			country: '',
			skill: undefined,
			sort: ''
	};
  });
