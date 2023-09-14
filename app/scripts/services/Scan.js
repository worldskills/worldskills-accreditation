(function() {
    'use strict';

    angular.module('accreditationApp').service('Scan', function ($resource, REST_BASE_URL) {

        return $resource(REST_BASE_URL + '/accreditation/events/:eventId/scans/:id', {
            id: '@id'
        }, {
            query: {
                method: 'GET'
            },
        });

    });

})();
