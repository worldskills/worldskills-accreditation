(function() {
    'use strict';

    angular.module('accreditationApp').controller('PackageOptionListCtrl', function ($scope, $stateParams, PackageOption) {

        $scope.options = PackageOption.query({event: $stateParams.eventId});

    });

    angular.module('accreditationApp').controller('PackageOptionCtrl', function ($scope, $stateParams, $state, $q, alert, PackageOption, Zone) {

        $scope.option = PackageOption.get({id: $stateParams.id});

        $scope.zones = Zone.query({eventId: $stateParams.eventId});

        $scope.optionZones = PackageOption.getZones({id: $stateParams.id}, function () {
            $scope.zones.$promise.then(function () {
                angular.forEach($scope.zones.zones, function (zone) {
                    angular.forEach($scope.optionZones.zones, function (packageOptionZone) {
                        if (packageOptionZone.id === zone.id) {
                            zone.checked = true;
                        }
                    });
                });
            });
        });

        $scope.save = function() {
            $scope.loading = true;

            var zones = $scope.zones.zones.filter(function (zone) { return zone.checked });
            PackageOption.updateZones({id: $stateParams.id}, {zones: zones}, function () {
                alert.success('The Package Option has been saved successfully.');
                $state.go('main.event.package_option_list');
            });
        }

    });

})();
