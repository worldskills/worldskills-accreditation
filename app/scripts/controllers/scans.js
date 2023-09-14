'use strict';

angular.module('accreditationApp').controller('ScansCtrl', function ($scope, $rootScope, $stateParams, $filter, Scan, DelegateType, Zone) {

	$scope.loading = true;

	$scope.filter = {};
	$scope.filter.eventId = $stateParams.eventId;

	$scope.clear = function() {
		$scope.filter.delegateType = undefined;
		$scope.filter.zone = undefined;
		$scope.filterResults();
	};

	$scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});

	$scope.zones = Zone.query({eventId: $stateParams.eventId});

	$scope.filterResults = function()
	{
		$scope.loading = true;

		var query = {
			eventId: $stateParams.eventId,
		};
		if ($scope.filter.delegateType) {
			query['delegate_type'] = $scope.filter.delegateType;
		}
		if ($scope.filter.zone) {
			query['zone'] = $scope.filter.zone;
		}
		Scan.query(query, function(result) {
			$scope.loading = false;
			$scope.scans = result;
		}, $rootScope.errorHandler);
	};

	$scope.filterResults();

	$scope.export = function() {

		var aoa = [
			[
				'timestamp',
				'first_name',
				'last_name',
				'delegate_type',
				'zone_code',
				'zone_name',
				'allowed'
			]
		];

		angular.forEach($scope.scans.scans, function (scan) {
			var data = [
				$filter('date')(scan.timestamp, 'yyyy-MM-dd HH:mm'),
				scan.accreditation.first_name,
				scan.accreditation.last_name,
				scan.accreditation.delegate_type.name,
				scan.zone.code,
				scan.zone.name,
				scan.allowed
			];

			aoa.push(data);
		});

		var workbook = XLSX.utils.book_new();

		var worksheet = XLSX.utils.aoa_to_sheet(aoa);

		XLSX.utils.book_append_sheet(workbook, worksheet, 'scans');

		var today = new Date().toISOString();
		XLSX.writeFile(workbook, 'accreditation_scans_' + today.replace(/[-:T]/ig, '').substring(0, 14) + '.xlsx');

	};
});
