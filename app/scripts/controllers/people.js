'use strict';

angular.module('accreditationApp')
.controller('PeopleListCtrl', function ($scope, $rootScope, $stateParams, $translate, alert, Restangular, Accreditation, Event, DelegateType, Member) {
	
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
		$scope.filter.member = undefined;
		$scope.filter.skill = undefined;
		$scope.filter.group = '';
		$scope.filter.printed = undefined;
		$scope.filter.photo = undefined;
		$scope.filter.sort = '';
		
		$scope.changePage();	
	};

	$scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});

	$scope.event.$promise.then(function () {
		var member = 1;
		if ($scope.event.member_id) {
			member = $scope.event.member_id;
		}
		$scope.members = Member.query({member_of: member, limit: 999});
	});

	$scope.changePage = function() 
	{
		$scope.loading = true;

		$rootScope.currentPeoplePage = $scope.current_page;

		var query = {
			eventId: $stateParams.eventId,
			name: $scope.filter.name,
			pos_name: $scope.filter.position,
			sort: $scope.filter.sort,
			limit: $scope.items_per_page,
			offset: $scope.items_per_page * ($scope.current_page-1)
		};
		if ($scope.filter.member) {
			query['member'] = $scope.filter.member;
		}
		if ($scope.filter.delegateTypes) {
			query['del_types'] = $scope.filter.delegateTypes;
		}
		if ($scope.filter.skill) {
			query['skill'] = $scope.filter.skill;
		}
		if ($scope.filter.group) {
			query['group'] = $scope.filter.group;
		}
		if ($scope.filter.printed !== undefined) {
			query['printed'] = $scope.filter.printed;
		}
		if ($scope.filter.photo !== undefined) {
			query['photo'] = $scope.filter.photo;
		}
		Accreditation.query(query, function(result) {
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


