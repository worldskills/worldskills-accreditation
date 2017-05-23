(function () {
    'use strict';

    angular.module('accreditationApp').provider('auth', function () {

        /**
         * Copied from angular.js
         *
         * Tries to decode the URI component without throwing an exception.
         *
         * @private
         * @param str value potential URI component to check.
         * @returns {boolean} True if `value` can be decoded
         * with the decodeURIComponent function.
         */
        function tryDecodeURIComponent(value) {
          try {
            return decodeURIComponent(value);
          } catch(e) {
            // Ignore any invalid uri component
          }
        }

        /**
         * Copied from angular.js
         *
         * Parses an escaped url query string into key-value pairs.
         *
         * @returns Object.<(string|boolean)>
         */
        function parseKeyValue(/**string*/keyValue) {
          var obj = {}, key_value, key;
          angular.forEach((keyValue || '').split('&'), function(keyValue){
            if ( keyValue ) {
              key_value = keyValue.split('=');
              key = tryDecodeURIComponent(key_value[0]);
              if ( angular.isDefined(key) ) {
                var val = angular.isDefined(key_value[1]) ? tryDecodeURIComponent(key_value[1]) : true;
                if (!obj[key]) {
                  obj[key] = val;
                } else if(isArray(obj[key])) {
                  obj[key].push(val);
                } else {
                  obj[key] = [obj[key],val];
                }
              }
            }
          });
          return obj;
        }

        function random(length) {
            var result = '', chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            for (var i = length; i > 0; --i) {
            	result += chars[Math.round(Math.random() * (chars.length - 1))];
            }
            return result;
        }

        var params = parseKeyValue(window.location.hash.substr(1));

        var oauthState = sessionStorage.getItem('oauth_state');
        if (!oauthState) {
            // generate new OAuth state
            oauthState = random(32);
            sessionStorage.setItem('oauth_state', oauthState);
        }
        
        
        // parse access token and state from URL
        var accessToken = params.access_token;
        var state = params.state;
        if (!accessToken) {
            // try to retrive access token from storage
            accessToken = sessionStorage.getItem('access_token');
        } else {
            // verify state
            if (state != oauthState) {
                // invalid state, clear access token
                accessToken = null;
            } else {
                // store access token
                sessionStorage.setItem('access_token', accessToken);
            }
        }
        
        this.$get = ['$rootScope', '$http', 'CLIENT_ID', 'AUTHORIZE_URL', 'LOGOUT_URL', 'API_AUTH', 'Restangular', '$injector',
                     function($rootScope, $http, CLIENT_ID, AUTHORIZE_URL, LOGOUT_URL, API_AUTH, Restangular, $injector) {

        	var appUrl = window.location.href.replace(window.location.hash, '');

            var auth = {};
            auth.accessToken = accessToken;
            auth.loggedIn = !!auth.accessToken;
            auth.loginUrl = AUTHORIZE_URL + '?response_type=token&state=' + encodeURIComponent(oauthState) + '&client_id=' + encodeURIComponent(CLIENT_ID) + '&redirect_uri=' + encodeURIComponent(appUrl);
            auth.logoutUrl = LOGOUT_URL + '?client_id=' + encodeURIComponent(CLIENT_ID) + '&redirect_uri=' + encodeURIComponent(appUrl);

            auth.logout = function () {

                // delete access token and OAuth state
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('oauth_state');
                Restangular.setDefaultHeaders({'Authorization': ''});

                // redirect to logout page
                document.location.href = auth.logoutUrl;
            };

            // add access token header
            if (auth.loggedIn) {
                $http.defaults.headers.common.Authorization = 'Bearer ' + auth.accessToken;
                Restangular.setDefaultHeaders({'Authorization': 'Bearer ' + auth.accessToken})
            }

            var user = $http({method: 'GET', url: API_AUTH + '/users/loggedIn'})
                .success(function(data, status, headers, config) {
                	auth.user = data;
                	// check the user is allowed to use the application
                	var authenticator = $injector.get('authenticator');
                    if (!authenticator.authenticate(data))
                    {
                    	sessionStorage.setItem('redirect_to_state', toState.name);
                        sessionStorage.setItem('redirect_to_params', angular.toJson(toParams));
                        
                    	document.location.href = auth.loginUrl;
                    }
                }).
                error(function(data, status, headers, config) {
                	// error getting current user, clear access token
                    sessionStorage.removeItem('access_token');
                    auth.accessToken = null;
                    auth.loggedIn = false;
                });

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if (typeof toState.data != 'undefined' && !!toState.data.requireLoggedIn) {
                    user.error(function () {
                    	sessionStorage.setItem('redirect_to_state', toState.name);
                        sessionStorage.setItem('redirect_to_params', angular.toJson(toParams));
                        
                        // error loading loggedIn user, redirect to login
                        document.location.href = auth.loginUrl;
                    });
                }
            });

            return auth;
        }];
    });
})();
