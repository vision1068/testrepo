/**
 * Created by Fahad Saeed on 1/7/2016.
 */

export class AuthService {
  constructor ($cookies, $state) {
    'ngInject';
      return {
        isLogin(){
          return !!$cookies.get('token-actiloo');
        },

        getToken(){
          return $cookies.get('token-actiloo');
        },

        setToken(key){
          $cookies.put('token-actiloo', key.access_token);
          $cookies.put('refresh-token-actiloo', key.refresh_token);
        },

        removeToken(){
          $cookies.remove('token-actiloo');
          $cookies.remove('refresh-token-actiloo');
        },

        logout(){
          this.removeToken();
          $state.go('actiloo.subscription.signin');
        }
      }

  }
}
