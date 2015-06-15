'use strict';

angular.module('accreditationApp')
.controller('PersonCtrl', function ($scope, $rootScope, $state, $stateParams, $translate, alert, Restangular, PEOPLE_APP) {
	
	$scope.loading = true;
	
	$scope.eventId = $stateParams.event_id;
	$scope.personId = $stateParams.person_id;
	$scope.peopleApp = PEOPLE_APP;
	
	// load the event info
	Restangular.one('accreditation/events', $scope.eventId).get().then(function(result) 
		{
			$scope.event = result;
		}, $rootScope.errorHandler);
	
	$scope.getPerson = function()
	{
		$scope.loading = true;
		Restangular.one('accreditation/events', $scope.eventId).one('people', $scope.personId).one('full').get().then( function(result) 
		{
			$scope.person = result;
			$scope.loading = false;
		}, $rootScope.errorHandler);
	};
	
	// handler for a successful save
	var successHandler = function()
	{
		$scope.loading = false;
		$translate('PersonSaveMsg').then(function(msg)
		{
			alert.success(msg);
			$state.go('people', {event_id: $scope.eventId});
		});
	};
	
	$scope.save = function()
	{
		var data = {
				"position": $scope.person.accreditation.position,
				"organization_name": $scope.person.accreditation.organization_name,
				"hide_country": $scope.person.accreditation.hide_country,
				"country_id": $scope.person.accreditation.country.id
		};
		Restangular.one('accreditation/events', $scope.eventId).one('people', $scope.personId).one('accreditation')
			.customPUT(data).then(successHandler, $rootScope.errorHandler);
	};
	
	$scope.getPerson();
});