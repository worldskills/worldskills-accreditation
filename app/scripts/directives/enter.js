'use strict';

angular.module('accreditationApp')
	.directive('wsiEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.wsiEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });