'use strict';

describe('Controller: TestcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('accreditationApp'));

  var TestcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestcontrollerCtrl = $controller('TestcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
