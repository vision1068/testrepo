/**
 * Created by Fahad Saeed on 12/22/2015.
 */


export class SignInController {
  constructor (HttpService, global, $cookies, $state, $rootScope, $log, toastr) {
    'ngInject';
    let  vm = this;
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$cookies = $cookies;
    vm.$state = $state;
    vm.$rootScope = $rootScope;
    vm.toastr  = toastr;
    vm.$log = $log;
    vm.active();
  }

  active(){
    let vm = this;
    if(vm.$cookies.get('_ae') && vm.$cookies.get('_ap') ){
      vm.rememberMe = true;
      vm.email = atob(atob(vm.$cookies.get('_ae')));
      vm.password = atob(atob(vm.$cookies.get('_ap')));
    }
  }

  /******************** Confirmation code form ********************/
  signIn(form){
    let vm = this;
    vm.error = false;
    vm.submitted = true;
    if(form.$valid){
      vm.loading = true;
      let params = {
        client_id : 'webapp',
        grant_type : 'password',
        password : vm.password,
        username : vm.email
      };
      (vm.HttpService.get('oauth/token', params)).then(
        function(res){
          vm.loading = false;
          if(res.access_token){
            vm.getUserInfo();
            vm.token(res);
            vm.$state.go('actiloo.home');
            vm.$rootScope.$broadcast('user:login');
          }
        },
        function(err){
          vm.loading = false;
          vm.toastr.error(err.data.error_description);
        });
    }
  }

  /******************** Get user information ********************/
  getUserInfo(){
    let vm = this;
    (vm.HttpService.get('users/me/min')).then(
      function(res){
        if(res){
          vm.global.user = res;
          vm.$cookies.put('info', btoa(btoa(JSON.stringify(res))));
          vm.$rootScope.$broadcast('user:Info');
        }
      });
  }

  /******************** Token save and Check Remember me ********************/
  token(res){
    let vm = this;
    vm.$cookies.put('token-actiloo', res.access_token);
    vm.$cookies.put('refresh-token-actiloo', res.refresh_token);
    if(vm.rememberMe){
      vm.$cookies.put('_ae', btoa(btoa(vm.email)));
      vm.$cookies.put('_ap', btoa(btoa(vm.password)));
    }
    else{
      vm.$cookies.remove('_ae');
      vm.$cookies.remove('_ap');
    }
  }

}
