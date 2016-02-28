export function HeaderDirective() {
  'ngInject';

  return  {
    restrict: 'E',
    templateUrl: 'app/components/header/header.html',
    scope: {},
    controller: HeaderController,
    controllerAs: 'vm',
    bindToController: true
  };

}

class HeaderController {
  constructor (global, $scope,  HttpService, $cookies, $state) {
    'ngInject';
    let vm = this;
    vm.global = global;
    vm.HttpService = HttpService;
    vm.isLogin = vm.global.isLogin();
    vm.$cookies = $cookies;
    vm.$state = $state;
    $scope.$on('user:login', function(){
      vm.isLogin = vm.global.isLogin();
    });

    $scope.$on('user:Info', function(){
      vm.user = vm.global.user;
    });

    vm.active();
  }

  active(){
    let vm = this;
    if(vm.global.isLogin()) {
      vm.user = JSON.parse(atob(atob(vm.$cookies.get('info'))));
      vm.global.user = vm.user;
      /*      (vm.HttpService.get('users/me/min')).then(
       function (res) {
       if (res) {
       vm.user = res;
       vm.global.user = res;
       vm.$cookies.put('info', btoa(btoa(JSON.stringify(res))));
       }
       }
       );*/
    }
  }

  logout(){
    this.$cookies.remove('token-actiloo');
    this.$cookies.remove('refresh-token-actiloo');
    this.isLogin = this.global.isLogin();
    this.$state.go('actiloo.subscription.signin');
  }

}
