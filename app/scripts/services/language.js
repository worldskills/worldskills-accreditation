'use strict';

angular.module('accreditationApp')
  .service('Language', function Language() {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var LanguageService = {
			selectedLanguage: 'en'	//defaults to en_US
    };

    return LanguageService;
  });
