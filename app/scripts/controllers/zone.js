(function() {
    'use strict';

    angular.module('accreditationApp').controller('ZoneListCtrl', function ($scope, $stateParams, Zone) {

        $scope.zones = Zone.query({eventId: $stateParams.eventId});

        $scope.moveUp = function (sort, zone) {
            var index = $scope.zones.zones.indexOf(zone);
            var newZone = $scope.zones.zones[index];
            var oldZone = $scope.zones.zones[index - 1];
            $scope.zones.zones[index - 1] = newZone;
            $scope.zones.zones[index] = oldZone;
            $scope.save();
        };

        $scope.moveDown = function (sort, zone) {
            var index = $scope.zones.zones.indexOf(zone);
            var newZone = $scope.zones.zones[index];
            var oldZone = $scope.zones.zones[index + 1];
            $scope.zones.zones[index + 1] = newZone;
            $scope.zones.zones[index] = oldZone;
            $scope.save();
        };

        $scope.save = function () {
            angular.forEach($scope.zones.zones, function (zone, index) {
                zone.sort = index + 1;
            });
            Zone.updateSort({eventId: $stateParams.eventId}, $scope.zones);
        };

    });

    angular.module('accreditationApp').controller('ZoneCtrl', function ($scope, $state, $stateParams, alert, Event, Zone) {

        $scope.event = Event.get({id: $stateParams.eventId});

        $scope.zoneId = $stateParams.id;

        if ($scope.zoneId) {
            $scope.zone = Zone.get({eventId: $stateParams.eventId, id: $scope.zoneId}, function () {
                $scope.zoneName = $scope.zone.name;
            });
        } else {
            var maxSort = 1;
            Zone.query({eventId: $stateParams.eventId}, function (zones) {
              zones.zones.forEach(function (zone) {
                  maxSort = Math.max(maxSort, zone.sort);
              });
              $scope.zone.sort = maxSort + 1;
            });
            $scope.zone = new Zone();
            $scope.zone.color = '#003764';
        }

        $scope.save = function() {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                $scope.loading = true;
                if ($scope.zone.id) {
                    $scope.zone.$update({eventId: $stateParams.eventId}, function () {
                        alert.success('The zone has been saved successfully.');
                        $state.go('main.event.zone_list', {eventId: $stateParams.eventId});
                    });
                } else {
                    $scope.zone.$save({eventId: $stateParams.eventId}, function () {
                        alert.success('The zone has been added successfully.');
                        $state.go('main.event.zone_list', {eventId: $stateParams.eventId});
                    });
                }
            }
        };

        $scope.delete = function() {
            if (alert.confirm('Deleting the zone will also delete all data associated with this zone. Click OK to proceed.')) {
                $scope.deleteLoading = true;
                $scope.zone.$delete({eventId: $stateParams.eventId}, function () {
                    alert.success('The zone has been deleted successfully.');
                    $state.go('main.event.zone_list', {eventId: $stateParams.eventId});
                });
            }
        };
    });

})();
