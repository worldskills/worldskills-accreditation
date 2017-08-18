(function() {
    'use strict';

    angular.module('accreditationApp').controller('PositionsCtrl', function ($scope, $stateParams, Position, DelegateType) {

        $scope.positions = Position.query({eventId: $stateParams.eventId});
        $scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});

        $scope.moveUp = function (sort, position) {
            var index = $scope.positions.positions.indexOf(position);
            var newPosition = $scope.positions.positions[index];
            var oldPosition = $scope.positions.positions[index - 1];
            $scope.positions.positions[index - 1] = newPosition;
            $scope.positions.positions[index] = oldPosition;
            $scope.save();
        };

        $scope.moveDown = function (sort, position) {
            var index = $scope.positions.positions.indexOf(position);
            var newPosition = $scope.positions.positions[index];
            var oldPosition = $scope.positions.positions[index + 1];
            $scope.positions.positions[index + 1] = newPosition;
            $scope.positions.positions[index] = oldPosition;
            $scope.save();
        };

        $scope.save = function () {
            angular.forEach($scope.positions.positions, function (position, index) {
                position.sort = index + 1;
            });
            Position.update({eventId: $stateParams.eventId}, $scope.positions);
        };

    });

})();
