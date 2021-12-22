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

    auth.hasUserRole(API_AUTH_CODE, 'Admin').then(function (hasUserRole) {
        if (hasUserRole) {
            $scope.userIsAdmin = true;
        }
    });
    
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

    $rootScope.filter = {
			firstName: '',
			lastName: '',
			position: '',
			member: undefined,
			skill: undefined,
			sort: ''
	};
  });
