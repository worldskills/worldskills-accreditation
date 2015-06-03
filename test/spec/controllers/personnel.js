'use strict';

describe('Controller: PersonnelCtrl', function () {

  // load the controller's module
  beforeEach(module('accreditationApp'));

  var PersonnelCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PersonnelCtrl = $controller('PersonnelCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
