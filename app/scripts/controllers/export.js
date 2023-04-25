'use strict';

angular.module('accreditationApp').controller('ExportCtrl', function ($scope, $rootScope, $stateParams, $timeout, alert, DelegateType, Zone, Accreditation) {

    $scope.eventId = $stateParams.eventId;

    $scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});

	$scope.zones = Zone.query({eventId: $stateParams.eventId});

    $scope.hasZone = function (accreditation, zone) {
        var hasZone = false;
        angular.forEach(accreditation.zones, function (accreditationZone) {
            if (accreditationZone.id === zone) {
                hasZone = true;
            }
        });
        return hasZone;
    };

    $scope.export = function() 
    {
        $scope.loading = true;

        $scope.accreditations = Accreditation.query({eventId: $scope.eventId, del_types: $scope.delegateType, limit: 10000}, function(result) {
            $scope.loading = false;

            var aoa = [
                [
                    'id',
                    'delegate_type',
                    'color',
                    'text_color',
                    'first_name',
                    'last_name',
                    'line_1',
                    'line_2',
                    'line_3',
                    'image'
                ]
            ];

            angular.forEach($scope.zones.zones, function (zone) {
                aoa[0].push('zone_' + zone.code);
            });
    
            angular.forEach($scope.accreditations.people, function (accreditation) {
                var data = [
                    accreditation.id,
                    accreditation.delegate_type.name,
                    accreditation.delegate_type.color,
                    accreditation.delegate_type.text_color,
                    accreditation.first_name,
                    accreditation.last_name,
                    accreditation.lines[0],
                    accreditation.lines[1],
                    accreditation.lines[2],
                    accreditation.image ? accreditation.image.thumbnail + '_accreditation' : ''
                ];

                angular.forEach($scope.zones.zones, function (zone) {
                    data.push($scope.hasZone(accreditation, zone.id) ? 'Y' : '');
                });

                aoa.push(data);
            });
    
            var workbook = XLSX.utils.book_new();
    
            var worksheet = XLSX.utils.aoa_to_sheet(aoa);
    
            XLSX.utils.book_append_sheet(workbook, worksheet, 'accreditations');
    
            var today = new Date().toISOString();
            XLSX.writeFile(workbook, 'accreditations_' + today.replace(/[-:T]/ig, '').substring(0, 14) + '.xlsx');

        }, $rootScope.errorHandler);
    };

});
