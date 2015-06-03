'use strict';

angular.module('accreditationApp')
	.service('user', function(auth, authenticator, API_AUTH_CODE)
	{
		this.hasPermission = function(permission)
		{
			
			return authenticator.hasPermission(auth.user, API_AUTH_CODE, permission);
		};

	});