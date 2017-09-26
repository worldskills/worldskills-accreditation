'use strict';

angular.module('accreditationApp').controller('ImportCtrl', function ($scope, $rootScope, $stateParams, alert, Upload, REST_BASE_URL) {

    $scope.eventId = $stateParams.eventId;

    $scope.onFileSelect = function(files) {
        if (files && files.length) {
            $scope.loading = true;
            $scope.error = undefined;
            Upload.upload({
                url: REST_BASE_URL + '/accreditation/events/' + $scope.eventId + '/accreditations/import',
                file: files[0],
            }).then(function(response) {
                $scope.loading = false;
                $scope.accreditations = response.data;
            }, function(response) {
                $scope.loading = false;
                $scope.error = response.data;
            });
        }
    };

});
