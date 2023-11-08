(function() {
    'use strict';

    angular.module('accreditationApp').service('Accreditation', function ($resource, REST_BASE_URL) {

        return $resource(REST_BASE_URL + '/accreditation/events/:eventId/accreditations/:id', {
            id: '@id'
        }, {
            query: {
                method: 'GET'
            },
            update: {
                method: 'PUT'
            },
            printed: {
                method: 'PUT',
                url: REST_BASE_URL + '/accreditation/events/:eventId/accreditations/:id/printed',
            },
            distributed: {
                method: 'PUT',
                url: REST_BASE_URL + '/accreditation/events/:eventId/accreditations/:id/distributed',
            },
            resetRandomHash: {
                method: 'DELETE',
                url: REST_BASE_URL + '/accreditation/events/:eventId/accreditations/:id/randomHash',
            }
        });

    });

})();
