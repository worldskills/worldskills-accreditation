'use strict';

describe('Controller: Assessmentcriteria02Ctrl', function () {

  // load the controller's module
  beforeEach(module('accreditationApp'));

  var Assessmentcriteria02Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Assessmentcriteria02Ctrl = $controller('Assessmentcriteria02Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
