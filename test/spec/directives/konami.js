'use strict';

describe('Directive: konami', function () {

  // load the directive's module
  beforeEach(module('accreditationApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<konami></konami>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the konami directive');
  }));
});
