(function() {
    'use strict';

    angular.module('accreditationApp').service('PackageOption', function ($resource, REST_BASE_URL) {

        return $resource(REST_BASE_URL + '/accreditation/package_options/:id', {
            id: '@id'
        }, {
            query: {
                method: 'GET'
            },
            getZones: {
                method: 'GET',
                url: REST_BASE_URL + '/accreditation/package_options/:id/zones',
            },
            addZone: {
                method: 'PUT',
                url: REST_BASE_URL + '/accreditation/package_options/:id/zones/:zoneId',
            },
            removeZone: {
                method: 'DELETE',
                url: REST_BASE_URL + '/accreditation/package_options/:id/zones/:zoneId',
            }
        });

    });

})();
