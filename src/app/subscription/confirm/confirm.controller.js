/**
 * Created by Fahad Saeed on 12/26/2015.
 */

export class ConfirmController {
  constructor (HttpService, global, $state ,$log) {
    'ngInject';
    let  vm = this;
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$state = $state;
    vm.$log = $log;
  }


  /******************** Confirmation code form ********************/
  confirm(form){
    let vm = this;
    vm.submitted = true;
    if(form.$valid){
      let params = {
        userId : vm.global.confirm.id,
        token : vm.code
      };
      (this.HttpService.get('auth/confirm', params)).then(
        function(res){
          if(res.returnCode == 200){
            vm.$state.go('actiloo.subscription.signin');
          }
        },
        function(err){
          vm.$log.debug('confirm res....', err);
        });
    }
  }


}
