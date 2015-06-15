'use strict';

angular.module('accreditationApp')
.controller('MainCtrl', function ($scope, $rootScope, $state, $translate, Language, auth, user, API_AUTH_CODE, alert, Restangular, $http, OrgRestangular) {
    $scope.selectedLanguage = Language.selectedLanguage;
    
    $scope.auth = auth;
    $scope.user = user;
    
    $scope.API_AUTH_CODE = API_AUTH_CODE;
    
    $rootScope.currentPage = 1;
    $rootScope.currentPeoplePage = 1;
    $rootScope.filterTags = [];
    
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
    	$translate('Error').then(function(errLabel)
    	{
    		alert.error(errLabel + ' ' + response.data.code + ': ' + response.data.user_msg);
    	});
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
