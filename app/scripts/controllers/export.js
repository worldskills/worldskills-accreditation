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

});
