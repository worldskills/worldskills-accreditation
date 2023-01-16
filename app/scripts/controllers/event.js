'use strict';

angular.module('accreditationApp')
.controller('EventListCtrl', function ($scope, $rootScope, $stateParams, $translate, alert, Restangular, REST_BASE_URL, user) {
	  
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

angular.module('accreditationApp').controller('EventCtrl', function ($scope, $state, $stateParams, API_ACCREDITATION_CODE, auth, Event) {

    $scope.event = Event.get({id: $stateParams.eventId}, function () {

        auth.hasUserRole(API_ACCREDITATION_CODE, ['Admin', 'EditDelegateTypes'], $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditDelegateTypes = true;
            }
        });

        auth.hasUserRole(API_ACCREDITATION_CODE, ['Admin', 'EditPositions'], $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditPositions = true;
            }
        });

        auth.hasUserRole(API_ACCREDITATION_CODE, ['Admin', 'EditZones'], $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditZones = true;
            }
        });

	});

});
