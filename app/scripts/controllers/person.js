'use strict';

angular.module('accreditationApp')
.controller('PersonCreateCtrl', function ($scope, $rootScope, $state, $stateParams, $translate, alert, Restangular, Accreditation, DelegateType, Member, Skill, PEOPLE_APP) {
	
	$scope.loading = true;
	
	$scope.eventId = $stateParams.eventId;
	$scope.peopleApp = PEOPLE_APP;
	
	$scope.accreditation = new Accreditation();

	// load the event info
	Restangular.one('accreditation/events', $scope.eventId).get().then(function(result) 
		{
			$scope.event = result;
		}, $rootScope.errorHandler);

	$scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});
	$scope.members = Member.query({limit: 100});
	$scope.skills = Skill.query({eventId: $stateParams.eventId});

	// handler for a successful save
	var successHandler = function()
	{
		$scope.loading = false;
		$translate('PersonSaveMsg').then(function(msg)
		{
			alert.success(msg);
			$state.go('event.people', {eventId: $scope.eventId});
		});
	};
	
	$scope.save = function()
	{
		$scope.accreditation.$save({eventId: $scope.eventId}, successHandler, $rootScope.errorHandler);
	};
});

angular.module('accreditationApp')
.controller('PersonCtrl', function ($scope, $rootScope, $state, $stateParams, $translate, alert, Restangular, Accreditation, DelegateType, Member, Skill, PEOPLE_APP) {
	
	$scope.loading = true;
	
	$scope.eventId = $stateParams.eventId;
	$scope.accreditationId = $stateParams.accreditationId;
	$scope.peopleApp = PEOPLE_APP;
	
	// load the event info
	Restangular.one('accreditation/events', $scope.eventId).get().then(function(result) 
		{
			$scope.event = result;
		}, $rootScope.errorHandler);

	$scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});
	$scope.members = Member.query({limit: 100});
	$scope.skills = Skill.query({eventId: $stateParams.eventId});

	$scope.getPerson = function()
	{
		$scope.loading = true;
		$scope.accreditation = Accreditation.get({eventId: $scope.eventId, id: $scope.accreditationId}, function(accreditation) {
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
			$state.go('event.people', {eventId: $scope.eventId});
		});
	};
	
	$scope.save = function()
	{
		$scope.accreditation.$update({eventId: $scope.eventId}, successHandler, $rootScope.errorHandler);
	};

	$scope.getPerson();
});
'use strict';
