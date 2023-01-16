'use strict';

angular.module('accreditationApp')
	.service('authenticator', function(API_ACCREDITATION_CODE)
	{
		this.hasPermission = function(user, webServiceCode, permission)
        {
			if (!!user)
			{
				for (var i=0; i<user.roles.length; i++)
				{
					if (user.roles[i].name == permission 
							&& user.roles[i].role_application.application_code == webServiceCode)
					{
						return true;
					}
				}
			}
			return false;
       	};
		
		this.authenticate = function(user)
		{
			return this.hasPermission(user, API_ACCREDITATION_CODE, 'Admin') || this.hasPermission(user, API_ACCREDITATION_CODE, 'Edit');
		}
	});