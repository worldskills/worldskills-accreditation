'use strict';

angular.module('accreditationApp').controller('ScansCtrl', function ($scope, $rootScope, $stateParams, $filter, Scan, DelegateType, Zone, Member) {

	$scope.loading = true;

	$scope.filter = {};
	$scope.filter.eventId = $stateParams.eventId;

	$scope.clear = function() {
		$scope.filter.delegateType = undefined;
		$scope.filter.member = undefined;
		$scope.filter.zone = undefined;
		$scope.filterResults();
	};

	$scope.delegateTypes = DelegateType.query({eventId: $stateParams.eventId});

	$scope.zones = Zone.query({eventId: $stateParams.eventId});

	$scope.event.$promise.then(function () {
		var member = 1;
		if ($scope.event.member_id) {
			member = $scope.event.member_id;
		}
		$scope.members = Member.query({member_of: member, limit: 999});
	});

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
		if ($scope.filter.member) {
			query['member'] = $scope.filter.member;
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
				'date',
				'time',
				'first_name',
				'last_name',
				'delegate_type',
				'member_code',
				'member_name',
				'zone_code',
				'zone_name',
				'allowed'
			]
		];

		angular.forEach($scope.scans.scans, function (scan) {
			var data = [
				$filter('date')(scan.timestamp, 'dd.MM.yyyy'),
				$filter('date')(scan.timestamp, 'HH:mm'),
				scan.accreditation.first_name,
				scan.accreditation.last_name,
				scan.accreditation.delegate_type.name,
				scan.accreditation.member?.code,
				scan.accreditation.member?.name.text,
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
