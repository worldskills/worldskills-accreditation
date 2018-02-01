'use strict';

angular.module('accreditationApp')
.controller('EventListCtrl', function ($scope, $rootScope, $stateParams, $translate, alert, Restangular, REST_BASE_URL, user, API_AUTH_CODE) {
	  
	  $scope.current_page = $rootScope.currentPage;
	  $scope.items_per_page = 10;
	  
	  $scope.clear = function() {
			$scope.changePage(1);	
		};
		
	  $scope.changePage = function(page) 
	  {
		  $rootScope.loading = true;

		  Restangular.one('accreditation/events').get({limit: $scope.items_per_page, offset: $scope.items_per_page * ($scope.current_page-1), 
			  }).then( function(result) 
			  {
				  $scope.events = result;
				  $rootScope.loading = false;
			  }, $scope.errorHandler);
	  };
	  
	  $scope.filterResults = function()
	  {
		  $scope.changePage(1);
	  };
	  
	  $scope.changePage($scope.current_page);
  });

angular.module('accreditationApp').controller('EventCtrl', function ($scope, $state, $stateParams, Event) {

    $scope.event = Event.get({id: $stateParams.eventId});

});
