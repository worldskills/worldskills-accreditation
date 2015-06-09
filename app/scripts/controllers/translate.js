'use strict';

function TranslateCtrl($translate, $translateLocalStorage, $scope, Language) {

		//get current language from local storage		
		Language.selectedLanguage = $translateLocalStorage.get('NG_TRANSLATE_LANG_KEY');
		$scope.selectedLanguage = Language.selectedLanguage;

		$scope.changeLanguage = function(langKey){			
			$translate.use(langKey);
			Language.selectedLanguage = langKey;			
			$scope.selectedLanguage = langKey;
		};		

	};
