/**
 * Created by Fahad Saeed on 12/28/2015.
 */

export class AuthInterceptorFactory {
  constructor ($cookies, $q, $location, $injector) {
    'ngInject';
    return {
      request: function (config) {
        config.headers = config.headers || {};
        // if token is available
        if ($cookies.get('token-actiloo')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token-actiloo'); // set header for every request
        }
        return config;
      },

     'responseError': function(rejection) {

        // if user is unauthenticated
        if (rejection.status === 401) {

          // inject services
          var $http = $injector.get('$http'),
            Authentication = $injector.get('AuthService'),
            HttpService = $injector.get('HttpService'),
            defer = $q.defer(),

          // get auth value
            authToken = $cookies.get('token-actiloo'),
            authRefreshToken = $cookies.get('refresh-token-actiloo');

          // if access token is in cookie
          if(authToken){
            // if refresh token is in cookie
            if(authRefreshToken){
              (HttpService.get('oauth/token',{
                refresh_token : authRefreshToken,
                client_id : 'webapp',
                grant_type : 'refresh_token'
              })).then(
                function(res){
                  Authentication.setToken(res);
                  return defer.resolve($http(rejection.config));
                },
                function(){
                  Authentication.removeToken();
                  $location.path('/login');
                  return defer.reject();
                }
              );
            }
            return defer.promise;
          }
        }
        return $q.reject(rejection);
      }
    };
  }
}
