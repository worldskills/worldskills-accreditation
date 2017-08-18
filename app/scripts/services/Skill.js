(function() {
    'use strict';

    angular.module('accreditationApp').service('Skill', function ($resource, REST_BASE_URL) {

        return $resource(REST_BASE_URL + '/accreditation/events/:eventId/skills', {
            id: '@id'
        }, {
            query: {
                method: 'GET'
            }
        });

    });

})();
