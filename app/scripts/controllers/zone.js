(function() {
    'use strict';

    angular.module('accreditationApp').controller('ZoneListCtrl', function ($scope, $stateParams, Zone) {

        $scope.zones = Zone.query({eventId: $stateParams.eventId});

    });

    angular.module('accreditationApp').controller('ZoneCtrl', function ($scope, $state, $stateParams, alert, Event, Zone) {

        $scope.event = Event.get({id: $stateParams.eventId});

        $scope.zoneId = $stateParams.id;

        if ($scope.zoneId) {
            $scope.zone = Zone.get({eventId: $stateParams.eventId, id: $scope.zoneId}, function () {
                $scope.zoneName = $scope.zone.name;
            });
        } else {
            $scope.zone = new Zone();
            $scope.zone.color = '#003764';
            $scope.zone.sort = 1;
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
