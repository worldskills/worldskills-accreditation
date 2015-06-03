'use strict';

describe('Controller: AssessmentCtrl', function () {

  // load the controller's module
  beforeEach(module('accreditationApp'));

  var AssessmentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssessmentCtrl = $controller('AssessmentCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
