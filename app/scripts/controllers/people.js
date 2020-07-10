'use strict';

angular.module('accreditationApp')
.controller('PeopleListCtrl', function ($scope, $rootScope, $stateParams, $translate, alert, Restangular, Accreditation, Event, DelegateType) {
	
	$scope.loading = true;

	$scope.current_page = $rootScope.currentPeoplePage;
	$scope.items_per_page = 10;

	$scope.filter = {};
	$scope.filter.eventId = $stateParams.eventId;

	$scope.clear = function() {
		$scope.current_page = 1;
		$scope.filter.firstName = '';
		$scope.filter.lastName = '';
		$scope.filter.delegateTypes = [];
		$scope.filter.position = '';
		$scope.filter.country = '';
		$scope.filter.skill = undefined;
		$scope.filter.sort = '';
		
		$scope.changePage();	
	};

	$scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});

	$scope.changePage = function() 
	{
		$scope.loading = true;

		$rootScope.currentPeoplePage = $scope.current_page;

		Accreditation.query({eventId: $stateParams.eventId, name: $scope.filter.name, 
			pos_name: $scope.filter.position, country: $scope.filter.country,
			skill: $scope.filter.skill, del_types: $scope.filter.delegateTypes, sort: $scope.filter.sort, 
			limit: $scope.items_per_page, offset: $scope.items_per_page * ($scope.current_page-1) 
		}, function(result) {
			$scope.loading = false;
			$scope.accreditations = result;
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
		Restangular.one('accreditation/events', $stateParams.eventId).one('skills').get().then( function(result) 
				{
			$scope.skills = result.skills;
				}, $rootScope.errorHandler);
	};

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


