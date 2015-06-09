'use strict';

describe('Controller: TranslateCtrl', function () {

  // load the controller's module
  beforeEach(module('worldSkillsApp'));

  var TranslateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TranslateCtrl = $controller('TranslateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
