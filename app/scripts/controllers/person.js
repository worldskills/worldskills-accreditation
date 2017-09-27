'use strict';

angular.module('accreditationApp')
.controller('PersonCreateCtrl', function ($scope, $rootScope, $state, $stateParams, $translate, $q, Upload, alert, Restangular, Accreditation, DelegateType, Member, Skill, Zone, PEOPLE_APP, WORLDSKILLS_API_IMAGES) {

    var image = $q.when();

	$scope.loading = true;
	
	$scope.eventId = $stateParams.eventId;
	$scope.peopleApp = PEOPLE_APP;

    $scope.onFileSelect = function($files) {
        var deferred = $q.defer();
        image = deferred.promise;
        Upload.upload({
            url: WORLDSKILLS_API_IMAGES,
            file: $files[0],
        }).then(function(response) {
            deferred.resolve(response.data);
        });
    };

	$scope.accreditation = new Accreditation();
	$scope.accreditation.zones_add = [];
	$scope.accreditation.zones_remove = [];

	// load the event info
	Restangular.one('accreditation/events', $scope.eventId).get().then(function(result) 
		{
			$scope.event = result;
		}, $rootScope.errorHandler);

	$scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});
	$scope.members = Member.query({limit: 100});
	$scope.skills = Skill.query({eventId: $stateParams.eventId});

	$scope.accreditationZones = {};
	$scope.zones = Zone.query({eventId: $stateParams.eventId}, function () {
		angular.forEach($scope.zones.zones, function (zone) {
			zone.access = false;
			$scope.accreditationZones[zone.code] = zone;
		});
	});

	$scope.updateZones = function () {
		angular.forEach($scope.zones.zones, function (zone) {
			zone.access = false;
			if ($scope.accreditation.delegate_type) {
				angular.forEach($scope.accreditation.delegate_type.zones, function (delegateTypeZone) {
					if (delegateTypeZone.id === zone.id) {
						delegateTypeZone.zone = zone;
						zone.access = true;
					}
				});
			}
			angular.forEach($scope.accreditation.zones_add, function (accreditationZone) {
				if (accreditationZone.id === zone.id) {
					zone.access = true;
				}
			});
			angular.forEach($scope.accreditation.zones_remove, function (accreditationZone) {
				if (accreditationZone.id === zone.id) {
					zone.access = false;
				}
			});
		});
	};

	$scope.addZone = function (zone) {
		$scope.accreditation.zones_add.push(zone);
		$scope.updateZones();
	};

	$scope.removeZone = function (zone) {
		$scope.accreditation.zones_remove.push(zone);
		$scope.updateZones();
	};

	// handler for a successful save
	var successHandler = function()
	{
		$scope.loading = false;
		alert.success("Accreditation data saved");
		$state.go('event.people', {eventId: $scope.eventId});
	};

    $scope.changed = function ()
    {
    };

	$scope.save = function()
	{
        image.then(function (image) {
	        if (typeof image != 'undefined') {
	            $scope.accreditation.image = {id: image.id, thumbnail_hash: image.thumbnail_hash};
	        }
			$scope.accreditation.$save({eventId: $scope.eventId}, successHandler, $rootScope.errorHandler);
		});
	};
});

angular.module('accreditationApp')
.controller('PersonCtrl', function ($scope, $rootScope, $state, $stateParams, $translate, $q, $timeout, Upload, alert, Restangular, Accreditation, DelegateType, Member, Skill, Zone, PEOPLE_APP, WORLDSKILLS_API_IMAGES) {

    var image;

	$scope.loading = true;

    $scope.onFileSelect = function($files) {
        Upload.upload({
            url: WORLDSKILLS_API_IMAGES,
            file: $files[0],
        }).then(function(response) {
            image = response.data;
            $scope.save();
        });
    };

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

	$scope.accreditationZones = {};
	$scope.zones = Zone.query({eventId: $stateParams.eventId}, function () {
		angular.forEach($scope.zones.zones, function (zone) {
			zone.access = false;
			$scope.accreditationZones[zone.code] = zone;
		});
	});

	$scope.getPerson = function()
	{
		$scope.loading = true;
		$scope.accreditation = Accreditation.get({eventId: $scope.eventId, id: $scope.accreditationId}, function(accreditation) {
			$scope.loading = false;
		}, $rootScope.errorHandler);
	};

    $scope.hasNotZone = function (zone) {
        return !$scope.hasZone(zone);
    }

    $scope.hasZone = function (zone) {
        var hasZone = false;
        if ($scope.accreditation.summary) {
            angular.forEach($scope.accreditation.summary.zones, function (accreditationZone) {
                if (accreditationZone.code === zone.code) {
                    hasZone = true;
                }
            });
        }
        return hasZone;
    };

	$scope.addAddZone = function (zone) {
		$scope.accreditation.zones_add.push(zone);
		$scope.save();
	};

    $scope.removeAddZone = function (zone) {
        var index = $scope.accreditation.zones_add.indexOf(zone);
        $scope.accreditation.zones_add.splice(index, 1);
        $scope.save();
    };

	$scope.addRemoveZone = function (zone) {
		$scope.accreditation.zones_remove.push(zone);
		$scope.save();
	};

    $scope.removeRemoveZone = function (zone) {
        var index = $scope.accreditation.zones_remove.indexOf(zone);
        $scope.accreditation.zones_remove.splice(index, 1);
        $scope.save();
    };

    var accreditationTimeout;
    $scope.changed = function ()
    {
        if (accreditationTimeout) {
            $timeout.cancel(accreditationTimeout);
        }
        accreditationTimeout = $timeout($scope.save, 500);
    };

    $scope.save = function()
    {
        $scope.saved = false;
        $scope.saving = true;
        if (typeof image != 'undefined') {
            $scope.accreditation.image = {id: image.id, thumbnail_hash: image.thumbnail_hash};
        }
        Accreditation.update({eventId: $scope.eventId}, $scope.accreditation, function (response) {
            $scope.accreditation.summary = response.summary;
            $scope.saved = true;
            $scope.saving = false;
        }, $rootScope.errorHandler);
    };

    $scope.sync = function() {
        $scope.syncing = true;
        Accreditation.sync({eventId: $scope.eventId, id: $scope.accreditation.id}, {}, function (response) { 
            $scope.syncing = false;
            $scope.eas = response;
            $scope.eas.redirect += "&return_url=" + encodeURIComponent(window.location.href);
        }, $rootScope.errorHandler);
    };

	$scope.getPerson();
});
'use strict';
