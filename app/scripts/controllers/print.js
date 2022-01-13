'use strict';

angular.module('accreditationApp')
.controller('PrintCtrl', function ($scope, $rootScope, $state, $stateParams, Restangular, Accreditation, Zone, REST_BASE_URL) {

    $scope.loading = true;
    $scope.apiBaseUrl = REST_BASE_URL;

    $scope.date = new Date();
    $scope.limit = 10000;
    $scope.eventId = $stateParams.eventId;
    $scope.accreditations = [];

    var templates = {
      '587': 'ch-2022.html',
      '584': 'wsafrica-2022.html',
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
    
    $scope.zones = Zone.query({eventId: $stateParams.eventId});

    $scope.hasZone = function (accreditation, zone) {
        var hasZone = false;
        angular.forEach(accreditation.zones, function (accreditationZone) {
            if (accreditationZone.id === zone.id) {
                hasZone = true;
            }
        });
        return hasZone;
    };

    if ($stateParams.accreditationId) {

        $scope.loading = true;
        Accreditation.get({eventId: $scope.eventId, id: $stateParams.accreditationId}, function(accreditation) {
            $scope.loading = false;
            $scope.accreditations = [accreditation.summary];
        }, $rootScope.errorHandler);

    } else {
      
        var query = {eventId: $stateParams.eventId, name: $stateParams.name, 
            pos_name: $stateParams.position, member: $stateParams.member,
            skill: $stateParams.skill, del_types: $stateParams.delegateTypes, 
            limit: $scope.limit
        };
        if ($stateParams.printed !== undefined) {
            query['printed'] = $stateParams.printed;
        }
        if ($scope.filter.photo !== undefined) {
            query['photo'] = $scope.filter.photo;
        }
        Accreditation.query(query, function(result) {
            $scope.loading = false;
            $scope.accreditations = result.people;
        }, $rootScope.errorHandler);

    }

    window.matchMedia('print').addListener(function (mediaQueryListEvent) {
        if (mediaQueryListEvent.matches) {
            angular.forEach($scope.accreditations, function (accreditation) {
                Accreditation.printed({eventId: $stateParams.eventId}, accreditation);
            });
        }
    });

    $scope.print = function () {
        window.print();
    };

});
