'use strict';

angular.module('accreditationApp')
  .controller('MainCtrl', function ($scope, $rootScope, $state, $translate, Language, auth, user, API_AUTH_CODE, alert, Restangular, $http) {
    $scope.selectedLanguage = Language.selectedLanguage;
    
    $scope.auth = auth;
    $scope.user = user;
    
    $scope.API_AUTH_CODE = API_AUTH_CODE;
    
    $rootScope.currentPage = 1;
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
    
    $rootScope.tagOptions = {
    		'multiple': true,
    		'simple_tags': true,
    		'maximumInputLength': 100,
    		'tokenSeparators': [','],
    		'tags': ['blah']
    }

    $scope.exSearch = function()
    {
    	$rootScope.searchTerm = $scope.searchTerm;
    	if ($state.current.name == 'search')
    	{
    		$scope.runSearch();
    	}
    	else
    	{
    		$state.go('search');
    	}
    }
    
    $scope.runSearch = function() {
		  Restangular.one('resources/search').get({text: $scope.searchTerm}).then(function(result) {
			  $scope.searchResults = result;
		  }, $rootScope.errorHandler);
	  };
    
    
	  
  });
