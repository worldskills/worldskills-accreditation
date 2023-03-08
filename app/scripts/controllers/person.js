'use strict';

angular.module('accreditationApp')
.controller('PersonCreateCtrl', function ($scope, $rootScope, $state, $stateParams, $translate, $q, Upload, alert, Event, Accreditation, DelegateType, Member, Skill, Zone, PEOPLE_APP, WORLDSKILLS_API_IMAGES) {

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

    $scope.event = Event.get({id: $stateParams.eventId}, function () {

        auth.hasUserRole(API_ACCREDITATION_CODE, ['Admin', 'Edit'], $scope.event.ws_entity.id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEdit = false;
            }
        });

    });
    
	$scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});
	$scope.members = Member.query({limit: 100});
	$scope.skills = Skill.query({eventId: $stateParams.eventId});

	$scope.zones = Zone.query({eventId: $stateParams.eventId}, function () {
		angular.forEach($scope.zones.zones, function (zone) {
			zone.access = false;
		});
	});

    $scope.hasNotZone = function (zone) {
        return !$scope.hasZone(zone);
    }

    $scope.hasZone = function (zone) {
        var hasZone = false;
        angular.forEach($scope.zones_add, function (accreditationZone) {
            if (accreditationZone.id === zone.id) {
                hasZone = true;
            }
        });
        return hasZone;
    };

	$scope.addAddZone = function (zone) {
		$scope.accreditation.zones_add.push(zone);
	};

    $scope.removeAddZone = function (zone) {
        var index = $scope.accreditation.zones_add.indexOf(zone);
        $scope.accreditation.zones_add.splice(index, 1);
    };

	$scope.addRemoveZone = function (zone) {
		$scope.accreditation.zones_remove.push(zone);
	};

    $scope.removeRemoveZone = function (zone) {
        var index = $scope.accreditation.zones_remove.indexOf(zone);
        $scope.accreditation.zones_remove.splice(index, 1);
    };

	$scope.addZone = function (zone) {
		$scope.accreditation.zones_add.push(zone);
	};

	$scope.removeZone = function (zone) {
		$scope.accreditation.zones_remove.push(zone);
	};

	// handler for a successful save
	var successHandler = function(accreditation)
	{
		$scope.loading = false;
		alert.success("Accreditation data saved");
		$state.go('main.person', {eventId: $scope.eventId, accreditationId: accreditation.id});
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
.controller('PersonCtrl', function ($scope, $rootScope, $state, $stateParams, $translate, $q, $timeout, API_ACCREDITATION_CODE, Upload, auth, Event, Accreditation, DelegateType, Member, Skill, Zone, PEOPLE_APP, WORLDSKILLS_API_IMAGES) {

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

    $scope.event = Event.get({id: $stateParams.eventId}, function () {

        auth.hasUserRole(API_ACCREDITATION_CODE, ['Admin', 'Edit'], $scope.event.ws_entity.id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEdit = true;
            }
        });

    });

	$scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});
	$scope.members = Member.query({limit: 100});
	$scope.skills = Skill.query({eventId: $stateParams.eventId});

	$scope.zones = Zone.query({eventId: $stateParams.eventId}, function () {
		angular.forEach($scope.zones.zones, function (zone) {
			zone.access = false;
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
                if (accreditationZone.id === zone.id) {
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

	$scope.getPerson();
});
