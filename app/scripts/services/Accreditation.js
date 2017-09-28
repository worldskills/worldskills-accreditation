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
            sync: {
                method: 'PUT',
                url: REST_BASE_URL + '/accreditation/events/:eventId/accreditations/:id/eas/sync',
            },
            import: {
                method: 'POST',
                url: REST_BASE_URL + '/accreditation/events/:eventId/accreditations/import',
            }
        });

    });

})();
