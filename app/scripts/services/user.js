'use strict';

angular.module('accreditationApp')
	.service('user', function(auth, authenticator, API_ACCREDITATION_CODE)
	{
		this.hasPermission = function(permission)
		{
			
			return authenticator.hasPermission(auth.user, API_ACCREDITATION_CODE, permission);
		};

	});