'use strict';

angular.module('accreditationApp').controller('ExportCtrl', function ($scope, $rootScope, $stateParams, $timeout, alert, DelegateType, Accreditation) {

    $scope.eventId = $stateParams.eventId;

    $scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});

    $scope.hasZone = function (accreditation, zone) {
        var hasZone = false;
        angular.forEach(accreditation.zones, function (accreditationZone) {
            if (accreditationZone.code === zone) {
                hasZone = true;
            }
        });
        return hasZone;
    };
    
    $scope.load = function() 
    {
        $scope.loading = true;

        $scope.accreditations = Accreditation.query({eventId: $scope.eventId, del_types: $scope.delegateType, limit: 10000}, function(result) {
            $scope.loading = false;
        }, $rootScope.errorHandler);
    };

    $scope.sync = function()
    {
        $scope.syncing = true;

        var delay = 1000;

        angular.forEach($scope.accreditations.people, function (accreditation, i) {
            $timeout(function () {
                Accreditation.sync({eventId: $scope.eventId, id: accreditation.id}, {}, function (response) { 
                    accreditation.eas = response;
                }, function (response) {
                    accreditation.eas = {};
                    accreditation.eas.status = 'Error';
                    accreditation.eas.error_description = response.data;
                });
            }, i * delay);
        });

        $timeout(function () {
            $scope.syncing = false;
        }, $scope.accreditations.people.length * delay);
    };

});
