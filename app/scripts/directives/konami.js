'use strict';

angular.module('accreditationApp')
  .directive('konami', function () {
    return {
    restrict: "AEC",
    controller: function ($scope) {
      $scope.executeKonami = function () {
        //add custom konami fun below
        //you also need to add <konami/> to any view you want to enable to konami code in
        //$.getScript('http://www.cornify.com/js/cornify.js',function(){
        //  cornify_add();
        //  $(document).keydown(cornify_add);
        //}); 
    	$('.navbar-brand').html("STINKIN' BADGERS");
    	$scope.showBadger();
        //end konami fun
      }
    },
    link: function (scope, element, attrs) {
      
      var kon_index = 0,
      kon_keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
      
      $(document).keydown(function(e){
        if (e.keyCode === kon_keys[kon_index++]) {
          if (kon_index === kon_keys.length) {
            scope.executeKonami();
          }
        } else {
          kon_index = 0;
        }
      });
    }
  }
  });