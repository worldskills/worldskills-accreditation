(function() {
    'use strict';

    angular.module('accreditationApp').service('Zone', function ($resource, REST_BASE_URL) {

        return $resource(REST_BASE_URL + '/accreditation/events/:eventId/zones/:id', {
            id: '@id'
        }, {
            query: {
                method: 'GET'
            },
            update: {
                method: 'PUT'
            },
            updateSort: {
                method: 'PUT',
                url: REST_BASE_URL + '/accreditation/events/:eventId/zones/sort',
            },
        });

    });

})();
