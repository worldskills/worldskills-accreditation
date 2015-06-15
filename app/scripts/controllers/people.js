'use strict';

angular.module('accreditationApp')
.controller('PeopleListCtrl', function ($scope, $rootScope, $stateParams, $translate, alert, Restangular) {
	
	$scope.loading = true;
	
	$scope.eventId = $stateParams.event_id;
	
	$scope.current_page = $rootScope.currentPeoplePage;
	$scope.items_per_page = 10;
	
	$scope.clear = function() {
		$scope.current_page = 1;
		$scope.filter.firstName = '';
		$scope.filter.lastName = '';
		$scope.filter.position = '';
		$scope.filter.country = '';
		$scope.filter.skill = undefined;
		$scope.filter.sort = '';
		
		$scope.changePage();	
	};

	$scope.changePage = function() 
	{
		$scope.loading = true;

		$rootScope.currentPeoplePage = $scope.current_page;
		Restangular.one('accreditation/events', $scope.eventId).one('people').get({fn: $scope.filter.firstName, 
			ln: $scope.filter.lastName, pos_name: $scope.filter.position, country: $scope.filter.country,
			skill: $scope.filter.skill, sort: $scope.filter.sort, limit: $scope.items_per_page, offset: $scope.items_per_page * ($scope.current_page-1), 
		}).then( function(result) 
		{
			$scope.people = result;
			$scope.loading = false;
			$scope.loading = false;
		}, $rootScope.errorHandler);
	};

	$scope.filterResults = function()
	{
		$scope.current_page = 1;
		$scope.changePage();
	};
	
	// function for retrieving list of skills
	$scope.getSkills = function()
	{
		Restangular.one('accreditation/events', $scope.eventId).one('skills').get().then( function(result) 
				{
			$scope.skills = result.skills;
				}, $rootScope.errorHandler);
	};
	
	// load the event info
	Restangular.one('accreditation/events', $scope.eventId).get().then(function(result) 
		{
			$scope.event = result;
		}, $rootScope.errorHandler);

	$scope.getSkills();
	$scope.changePage();
});

angular.module('accreditationApp')
.controller('PeopleFilterController', function ($scope, $rootScope, $element)
{
	// filter the results when enter pressed in form
	$element.bind('keydown keypress', function (event) {
		if (event.keyCode === 13) { // enter key
			$scope.$apply(function() {
				$scope.filterResults();
			});
		}
	});
});


