'use strict';

angular.module('accreditationApp')
.controller('PersonCreateCtrl', function ($scope, $rootScope, $state, $stateParams, $translate, alert, Restangular, Accreditation, DelegateType, Member, Skill, Zone, PEOPLE_APP) {
	
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
	$scope.zones = Zone.query({eventId: $stateParams.eventId});

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
		$scope.accreditation.zones = [];
		angular.forEach($scope.zones.zones, function (zone) {
			if (zone.checked) {
				$scope.accreditation.zones.push(zone);
			}
		});
		$scope.accreditation.$save({eventId: $scope.eventId}, successHandler, $rootScope.errorHandler);
	};
});

angular.module('accreditationApp')
.controller('PersonCtrl', function ($scope, $rootScope, $state, $stateParams, $translate, alert, Restangular, Accreditation, DelegateType, Member, Skill, Zone, PEOPLE_APP) {
	
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
	$scope.zones = Zone.query({eventId: $stateParams.eventId});

	$scope.getPerson = function()
	{
		$scope.loading = true;
		$scope.accreditation = Accreditation.get({eventId: $scope.eventId, id: $scope.accreditationId}, function(accreditation) {
			$scope.loading = false;
			$scope.zones.$promise.then(function () {
				angular.forEach($scope.zones.zones, function (zone) {
					angular.forEach($scope.accreditation.zones, function (accreditationZone) {
						if (accreditationZone.id === zone.id) {
							zone.checked = true;
						}
					});
					if ($scope.accreditation.delegate_type) {
						angular.forEach($scope.accreditation.delegate_type.zones, function (delegateTypeZone) {
							if (delegateTypeZone.id === zone.id) {
								zone.existing = true;
							}
						});
					} else if ($scope.accreditation.position_delegate_type.delegate_type) {
						angular.forEach($scope.accreditation.position_delegate_type.delegate_type.zones, function (positionDelegateTypeZone) {
							if (positionDelegateTypeZone.id === zone.id) {
								zone.existing = true;
							}
						});
					}
				});
			});
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
		$scope.accreditation.zones = [];
		angular.forEach($scope.zones.zones, function (zone) {
			if (zone.checked) {
				$scope.accreditation.zones.push(zone);
			}
		});
		$scope.accreditation.$update({eventId: $scope.eventId}, successHandler, $rootScope.errorHandler);
	};

	$scope.getPerson();
});
'use strict';
