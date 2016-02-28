
export function runBlock ($rootScope, global, $state) {
  'ngInject';

  let call = $rootScope.$on("$stateChangeStart",function(event, next) {
    if(global.isLogin()){
      if(!next.authenticate){
        $state.go('actiloo.home');
        event.preventDefault();
      }
    }
    else{
      if(next.authenticate === "admin"){
        $state.go('actiloo.subscription.signin');
        event.preventDefault();
      }
    }
  });
  $rootScope.$on('$destroy', call)
}
