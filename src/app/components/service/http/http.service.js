/**
 * Created by Fahad Saeed on 12/26/2015.
 */
export class HttpService {
  constructor ($http, $q, global) {
    'ngInject';

    this.data = function(method, url, payload, params, isArray){
      let deferred, request,promise,paramsIs ;
      deferred = $q.defer();
      (typeof(global.locale) == 'string')
        ?(typeof(global.locale) == 'string' && typeof(params) == 'object' )
          ? (paramsIs = angular.extend(params , {locale : global.locale}))
          : (paramsIs =  {locale : global.locale})
        :  paramsIs = params ;
      //console.log('paramsIs...', paramsIs);
      request = $http({
        method: method,
        url: 'http://linkexp.ddns.net/actiloo/' + url ,
        params: paramsIs,
        data: payload,
        isArray : (isArray == 'isArray'),
        timeout: deferred.promise
      });
      promise = request.then(
        function(response) {
          return(response.data )},
        function(error) {
          return( $q.reject(error) );
        }
      );
      promise.abort = function() {
        deferred.resolve();
      };
      promise.finally(
        function() {
          promise.abort = angular.noop;
          deferred =  request = promise = null;
        }
      );
      return( promise );
    }


  }

  get(url, params, isArray) {
    return this.data('GET', url, {} , params, isArray);
  }

  post(url, payload, params, isArray) {
    return this.data('POST', url, payload, params, isArray);
  }

  put(url, payload, params, isArray) {
    return this.data('PUT', url, payload, params, isArray);
  }

}
