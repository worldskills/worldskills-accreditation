'use strict';

angular.module('accreditationApp').controller('ImportCtrl', function ($scope, $rootScope, $stateParams, $timeout, alert, Accreditation) {

    $scope.eventId = $stateParams.eventId;

    $scope.accreditations = {};

    $scope.onFileSelect = function(files) {
        if (files && files.length) {

            var reader = new FileReader();

            reader.onload = function (e) {
                /* read workbook */
                var bstr = e.target.result;
                var wb = XLSX.read(bstr, {type:'binary'});

                /* grab first sheet */
                var wsname = wb.SheetNames[0];
                var ws = wb.Sheets[wsname];

                /* grab first row and generate column headers */
                var aoa = XLSX.utils.sheet_to_json(ws, {header:1, raw:false});
                var cols = [];
                for(var i = 0; i < aoa[0].length; ++i) {
                    cols[i] = aoa[0][i];
                }

                /* generate rest of the data */
                var data = [];
                for(var r = 1; r < aoa.length; ++r) {
                    data[r-1] = {};
                    for (i = 0; i < aoa[r].length; ++i) {
                        if (aoa[r][i] == null) {
                            continue;
                        }
                        data[r-1][cols[[i]]] = aoa[r][i];
                    }
                }

                /* update scope */
                $scope.$apply(function() {
                    $scope.accreditations.data = data;
                });
            };

            reader.readAsBinaryString(files[0]);
        }
    };

    $scope.import = function () {

        $scope.importing = true;

        var delay = 6000;

        angular.forEach($scope.accreditations.data, function (accreditation, i) {
            $timeout(function () {
                Accreditation.import({eventId: $scope.eventId}, accreditation, function (response) {
                    accreditation.status = 'Imported';
                    accreditation.accreditation = response;
                }, function (response) {
                    accreditation.status = 'Error';
                })
            }, i * delay);
        });

        $timeout(function () {
            $scope.importing = false;
        }, $scope.accreditations.data.length * delay);
    };

});
