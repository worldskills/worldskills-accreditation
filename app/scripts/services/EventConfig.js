(function() {
    'use strict';

    angular.module('accreditationApp').service('EventConfig', function ($resource, REST_BASE_URL) {

        return $resource(REST_BASE_URL + '/accreditation/events/:id/config', {
            id: '@id'
        }, {
        });

    });

})();
