(function() {
    'use strict';

    angular.module('accreditationApp').service('Event', function ($resource, REST_BASE_URL) {

        return $resource(REST_BASE_URL + '/accreditation/events/:id', {
            id: '@id'
        }, {
        });

    });

})();
