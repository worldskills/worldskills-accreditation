'use strict';

describe('Controller: Assessmentcriteria01Ctrl', function () {

  // load the controller's module
  beforeEach(module('accreditationApp'));

  var Assessmentcriteria01Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Assessmentcriteria01Ctrl = $controller('Assessmentcriteria01Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
