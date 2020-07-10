'use strict';

angular.module('accreditationApp')
.controller('PrintCtrl', function ($scope, $rootScope, $state, $stateParams, Restangular, Accreditation, REST_BASE_URL) {

    $scope.loading = true;
    $scope.apiBaseUrl = REST_BASE_URL;

    $scope.date = new Date();

    $scope.eventId = $stateParams.eventId;
    $scope.accreditationId = $stateParams.accreditationId;

    // load the event info
    Restangular.one('accreditation/events', $scope.eventId).get().then(function(result) 
        {
            $scope.event = result;
        }, $rootScope.errorHandler);

    $scope.getPerson = function()
    {
        $scope.loading = true;
        $scope.accreditation = Accreditation.get({eventId: $scope.eventId, id: $scope.accreditationId}, function(accreditation) {
            $scope.loading = false;
        }, $rootScope.errorHandler);
    };

    $scope.getPerson();
});
