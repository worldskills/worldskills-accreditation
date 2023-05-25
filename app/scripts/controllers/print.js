'use strict';

angular.module('accreditationApp')
.controller('PrintCtrl', function ($scope, $rootScope, $state, $stateParams, $uibModal, Restangular, Accreditation, Zone, DelegateType, REST_BASE_URL) {

    $scope.loading = true;
    $scope.apiBaseUrl = REST_BASE_URL;

    $scope.date = new Date();
    $scope.limit = 10000;
    $scope.eventId = $stateParams.eventId;
    $scope.accreditations = [];

    var templates = {
      '587': 'ch-2022.html',
      '584': 'wsafrica-2022.html',
      '594': 'wsi-2022.html',
      '602': 'fi-2023.html',
      '603': 'wsi-2023-ciw.html',
    };

    var time = new Date().getTime();

    $scope.template = 'views/badges/default.html?v=' + time;
    if (typeof templates[$scope.eventId] !== 'undefined') {
      $scope.template = 'views/badges/' + templates[$scope.eventId] + '?v=' + time;
    }

    // load the event info
    Restangular.one('accreditation/events', $scope.eventId).get().then(function(result) 
        {
            $scope.event = result;
        }, $rootScope.errorHandler);
    
    $scope.zones = Zone.query({eventId: $stateParams.eventId});
	$scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});

    $scope.hasZone = function (accreditation, zone) {
        var hasZone = false;
        angular.forEach(accreditation.zones, function (accreditationZone) {
            if (accreditationZone.id === zone.id) {
                hasZone = true;
            }
        });
        return hasZone;
    };

    $scope.editAccreditations = function () {
        $scope.adHocModal = $uibModal.open({
            templateUrl: 'views/print_ad_hoc.html',
            controller: 'PrintAdHocCtrl',
            scope: $scope,
            animation: false,
            size: 'lg',
        });
    };

    if ($stateParams.adHoc) {

        $scope.adHoc = true;
        $scope.loading = false;
        $scope.accreditations = [];

        $scope.editAccreditations();

    } else if ($stateParams.accreditationId) {

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
        if ($stateParams.group) {
            query['group'] = $stateParams.group;
        }
        if ($stateParams.printed !== undefined) {
            query['printed'] = $stateParams.printed;
        }
        if ($stateParams.zone !== undefined) {
            query['zone'] = $stateParams.zone;
        }
        if ($stateParams.photo !== undefined) {
            query['photo'] = $stateParams.photo;
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

angular.module('accreditationApp').controller('PrintAdHocCtrl', function ($scope, $uibModalInstance) {

    $scope.resetPerson = function () {
        $scope.accreditation = {
            first_name: '',
            last_name: '',
            lines: '',
            delegateType: '',
            zones: [],
            edit: false
        };
    };
    $scope.resetPerson();

    $scope.addPerson = function () {
        $scope.accreditation.lines = $scope.accreditation.lines.split('\n');
        $scope.accreditations.push($scope.accreditation);
        $scope.resetPerson();
    };

    $scope.save = function () {
        $scope.accreditation.lines = $scope.accreditation.lines.split('\n');
        $scope.accreditations[$scope.accreditation.index] = $scope.accreditation;
        $scope.resetPerson();
    };

    $scope.edit = function (accreditation, index) {
        accreditation.edit = true;
        accreditation.index = index;
        $scope.accreditation = angular.copy(accreditation);
        $scope.accreditation.lines = $scope.accreditation.lines.join('\n');
    };

    $scope.remove = function (index) {
        $scope.accreditations.splice(index, 1);
    };

    $scope.preview = function () {
        $uibModalInstance.close();
    };

});
