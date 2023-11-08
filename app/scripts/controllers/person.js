'use strict';

angular.module('accreditationApp')
.controller('PersonCtrl', function ($scope, $rootScope, $state, $stateParams, $translate, $q, $timeout, API_ACCREDITATION_CODE, Upload, alert, auth, Event, Accreditation, DelegateType, Member, Skill, Zone, PEOPLE_APP, WORLDSKILLS_API_IMAGES) {

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

    $scope.markDistributed = function () {
        Accreditation.distributed({eventId: $stateParams.eventId}, $scope.accreditation);
    };

    $scope.invalidateBadge = function () {
        if (confirm('This will generate a new random code for the QR code. Any existing badge will no longer be valid. Proceed?')) {
            Accreditation.resetRandomHash({eventId: $stateParams.eventId}, $scope.accreditation, function () {
                alert.success('New random code for QR code generated, existing badges are now invalid.');
                $state.go('.', {}, {reload: true});
            });
        }
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
