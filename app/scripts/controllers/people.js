'use strict';

function PeopleListCtrl($scope, $rootScope, $stateParams, $translate, alert, Restangular) {
	
	$scope.eventId = $stateParams.event_id;
	
	console.log($rootScope.countries);
	
	$scope.current_page = $rootScope.currentPeoplePage;
	$scope.items_per_page = 10;
	
	$scope.filter = {
			firstName: '',
			lastName: '',
			position: '',
			country: '',
			skill: undefined,
			sort: ''
	}
	  
	$scope.clear = function() {
		$scope.current_page = 1;
		$scope.filter.firstName = '';
		$scope.filter.lastName = '';
		$scope.filter.position = '';
		$scope.filter.country = '';
		$scope.filter.skill = undefined;
		$scope.filter.sort = '';
		
		$scope.changePage();	
	}

	$scope.changePage = function() 
	{
		$rootScope.loading = true;

		$rootScope.currentPeoplePage = $scope.current_page;
		Restangular.one('accreditation/events', $scope.eventId).one('people').get({fn: $scope.filter.firstName, 
			ln: $scope.filter.lastName, pos_name: $scope.filter.position, country: $scope.filter.country,
			skill: $scope.filter.skill, sort: $scope.filter.sort, limit: $scope.items_per_page, offset: $scope.items_per_page * ($scope.current_page-1), 
		}).then( function(result) 
				{
			$scope.people = result;
			$rootScope.loading = false;
				}, $rootScope.errorHandler);
	};

	$scope.filterResults = function()
	{
		$scope.current_page = 1;
		$scope.changePage();
	}
	
	// load the event info
	Restangular.one('accreditation/events', $scope.eventId).get().then(function(result) 
			{
		$scope.event = result;
		$rootScope.loading = false;
			}, $rootScope.errorHandler);

	$scope.changePage();
}

function PeopleFilterController($scope, $rootScope, $stateParams, $translate, alert, Restangular, REST_BASE_URL, user, API_AUTH_CODE)
{

}


