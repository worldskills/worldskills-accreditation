'use strict';

angular.module('accreditationApp')
	.directive('wsiConfirmClick', [
        function(){
            return {
                link: function (scope, element, attr) {
                    var msg = attr.wsiConfirmClick || "Are you sure?";
                    var clickAction = attr.wsiConfirmedClick;
                    element.bind('click',function (event) {
                        if ( window.confirm(msg) ) {
                            scope.$eval(clickAction)
                        }
                    });
                }
            };
    }]);