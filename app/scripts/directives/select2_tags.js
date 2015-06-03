'use strict';

angular.module('accreditationApp')
  .directive('wsiTags', function () {
	  
	  return {
		  link: function(scope, element, attrs) {
			  scope.$watch(attrs.wsiTags, function(value) {
				  element.select2(scope.tagOptions);
			  });
		  }
	  }
  });