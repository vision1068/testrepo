/**
 * Created by Fahad Saeed on 2/1/2016.
 */

export class ConfirmationPopupController {
  constructor(HttpService, $state, global, $log, $uibModalInstance, resolve) {
    'ngInject';
    let vm = this;
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$state = $state;
    vm.$log = $log;
    vm.resolve = resolve;
    vm.$uibModalInstance = $uibModalInstance;
    vm.data =  resolve;
  }


  /********************* cancel popup *************************/
  cancel (){
    this.$uibModalInstance.dismiss();
  }


  yes() {
    let url,  vm = this;
    vm.loading = true;
    (vm.HttpService.get('reservations/' + vm.data.type ,{reservationId : vm.data.reservation.id , version : vm.data.reservation.version})).then(
      function(res){
        vm.loading = false;
        if(res.returnCode == 200){
          vm.$uibModalInstance.dismiss();
          vm.$state.go(vm.$state.current.name , vm.$state.params, {reload: true});
        }
        vm.$log.debug(vm.data.type , '...', res);
      },
      function(err){
        vm.loading = false;
        vm.$log.debug(vm.data.type , '...', err);
      }
    );
  }

}
