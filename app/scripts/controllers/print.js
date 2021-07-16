'use strict';

angular.module('accreditationApp')
.controller('PrintCtrl', function ($scope, $rootScope, $state, $stateParams, Restangular, Accreditation, REST_BASE_URL) {

    $scope.loading = true;
    $scope.apiBaseUrl = REST_BASE_URL;

    $scope.date = new Date();
    $scope.limit = 10000;
    $scope.eventId = $stateParams.eventId;
    $scope.accreditations = [];

    var templates = {
      //'316': 'wsc2017.html',
    };

    $scope.template = 'views/badges/default.html';
    if (typeof templates[$scope.eventId] !== 'undefined') {
      $scope.template = 'views/badges/' + templates[$scope.eventId];
    }

    // load the event info
    Restangular.one('accreditation/events', $scope.eventId).get().then(function(result) 
        {
            $scope.event = result;
        }, $rootScope.errorHandler);

    if ($stateParams.accreditationId) {

        $scope.loading = true;
        Accreditation.get({eventId: $scope.eventId, id: $stateParams.accreditationId}, function(accreditation) {
            $scope.loading = false;
            $scope.accreditations = [accreditation.summary];
        }, $rootScope.errorHandler);

    } else {

        Accreditation.query({eventId: $stateParams.eventId, name: $stateParams.name, 
            pos_name: $stateParams.position, country: $stateParams.country,
            skill: $stateParams.skill, del_types: $stateParams.delegateTypes, 
            limit: $scope.limit
        }, function(result) {
            $scope.loading = false;
            $scope.accreditations = result.people;
        }, $rootScope.errorHandler);

    }

});
