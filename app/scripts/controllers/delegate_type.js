(function() {
    'use strict';

    angular.module('accreditationApp').controller('DelegateTypeListCtrl', function ($scope, $stateParams, DelegateType) {

        $scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});

    });

    angular.module('accreditationApp').controller('DelegateTypeCtrl', function ($scope, $state, $stateParams, $http, alert, Downloader, Event, Zone, DelegateType, REST_BASE_URL) {

        $scope.event = Event.get({id: $stateParams.eventId});

        $scope.zones = Zone.query({eventId: $stateParams.eventId});

        $scope.delegateTypeId = $stateParams.id;

        if ($scope.delegateTypeId) {
            $scope.delegateType = DelegateType.get({eventId: $stateParams.eventId, id: $scope.delegateTypeId}, function () {
                $scope.delegateTypeName = $scope.delegateType.name;
                $scope.zones.$promise.then(function () {
                    angular.forEach($scope.zones.zones, function (zone) {
                        angular.forEach($scope.delegateType.zones, function (delegateTypeZone) {
                            if (delegateTypeZone.id === zone.id) {
                                zone.checked = true;
                            }
                        });
                    });
                });
            });
        } else {
            $scope.delegateType = new DelegateType();
        }

        $scope.save = function() {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                $scope.loading = true;

                $scope.delegateType.zones = [];
                angular.forEach($scope.zones.zones, function (zone) {
                    if (zone.checked) {
                        $scope.delegateType.zones.push(zone);
                    }
                });
                if ($scope.delegateType.id) {
                    $scope.delegateType.$update({eventId: $stateParams.eventId}, function () {
                        alert.success('The Delegate Type has been saved successfully.');
                        $state.go('event.delegate_type_list', {eventId: $stateParams.eventId});
                    });
                } else {
                    $scope.delegateType.$save({eventId: $stateParams.eventId}, function () {
                        alert.success('The Delegate Type has been added successfully.');
                        $state.go('event.delegate_type_list', {eventId: $stateParams.eventId});
                    });
                }
            }
        };

        $scope.delete = function() {
            if (alert.confirm('Deleting the Delegate Type will also delete all data associated with this Delegate Type. Click OK to proceed.')) {
                $scope.deleteLoading = true;
                $scope.delegateType.$delete({eventId: $stateParams.eventId}, function () {
                    alert.success('The Delegate Type has been deleted successfully.');
                    $state.go('event.delegate_type_list', {eventId: $stateParams.eventId});
                });
            }
        };

        $scope.export = function () {

            $http({url: REST_BASE_URL + '/accreditation/events/' + $stateParams.eventId + '/delegate_types/' + $scope.delegateTypeId + '/eas/export', method: 'PUT', responseType: 'blob'}).success(function(data, status, headers) {
               var filename = 'accreditation.xlsx';
               Downloader.handleDownload(data, status, headers, filename);
            })
            .error(function(data, status) {
                window.alert("Could not export!");
            });
        };
    });

})();
