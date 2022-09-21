'use strict';

angular.module('accreditationApp').controller('ExportCtrl', function ($scope, $rootScope, $stateParams, $timeout, alert, DelegateType, Zone, Accreditation) {

    $scope.eventId = $stateParams.eventId;

    $scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});

	$scope.zones = [63, 64];

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

        $scope.accreditations = Accreditation.query({eventId: $scope.eventId, del_types: $scope.delegateType, zone: $scope.zones, limit: 10000}, function(result) {
            $scope.loading = false;

            var aoa = [
                [
                    'id',
                    'delegate_type',
                    'color',
                    'text_color',
                    'first_name',
                    'last_name',
                    'email',
                    'zone_1',
                    'zone_2',
                    'zone_at1_green',
                    'zone_at1_red',
                    'line_1',
                    'line_2',
                    'line_3',
                    'image'
                ]
            ];
    
            angular.forEach($scope.accreditations.people, function (accreditation) {
                aoa.push([
                    accreditation.id,
                    accreditation.delegate_type.name,
                    accreditation.delegate_type.color,
                    accreditation.delegate_type.text_color,
                    accreditation.first_name,
                    accreditation.last_name,
                    '', // email
                    $scope.hasZone(accreditation, 46) ? 'Y' : 'N', // Skills
                    $scope.hasZone(accreditation, 47) ? 'Y' : 'N', // Offices
                    $scope.hasZone(accreditation, 63) ? 'Y' : 'N', // AT1 green
                    $scope.hasZone(accreditation, 64) ? 'Y' : 'N', // AT1 red
                    accreditation.lines[0],
                    accreditation.lines[1],
                    accreditation.lines[2],
                    accreditation.image ? accreditation.image.thumbnail + '_accreditation' : ''
                ])
            });
    
            var workbook = XLSX.utils.book_new();
    
            var worksheet = XLSX.utils.aoa_to_sheet(aoa);
            //var worksheet = XLSX.utils.json_to_sheet($scope.accreditations.people);
    
            XLSX.utils.book_append_sheet(workbook, worksheet, 'accreditations');
    
            var today = new Date().toISOString();
            XLSX.writeFile(workbook, 'WSC2022SE_AT1_accreditations_' + today.replace(/[-:T]/ig, '').substring(0, 14) + '.xlsx');

        }, $rootScope.errorHandler);
    };

});
