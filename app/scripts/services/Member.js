(function() {
    'use strict';

    angular.module('accreditationApp').service('Member', function ($resource, REST_BASE_URL) {

        return $resource(REST_BASE_URL + '/org/members', {
            id: '@id'
        }, {
            query: {
                method: 'GET'
            }
        });

    });

})();
