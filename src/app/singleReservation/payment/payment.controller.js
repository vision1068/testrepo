/**
 * Created by Fahad Saeed on 1/29/2016.
 */


export class PaymentController {
  constructor(HttpService, global, $log, $uibModalInstance, resolve) {
    'ngInject';
    let vm = this;
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$log = $log;
    vm.resolve = resolve;
    vm.$uibModalInstance = $uibModalInstance;
    vm.activate();
  }

  activate() {
    let vm = this;
    vm.participantIs = [];
    vm.hr = ['HH'];
    vm.min = ['MM'];
    for (let i = 0; i < 60; i++) {
      let a = ''+ i;
      (a.length != 1) || (a = '0' + a );
      if(i != 0 && i < 24 ){
        vm.hr.push(a)
      }
      vm.min.push(a)
    }

    vm.initialize()
  }

  /********************* initialize values *************************/
  initialize() {
    this.$log.debug('activity status....', this.resolve);
  }



  /********************* Submit Form *************************/
  submit (form){
    let vm = this;
    vm.submitted = true;

    if(form.$valid && vm.startDate.hr != 'HH' && vm.startDate.min != 'MM'){


     /* (vm.HttpService.post('reservations/new', vm.book )).then(
        function(res){
          if(res.returnCode == 200){
            vm.alert.message = 'Request sent';
            vm.alert.type = 'success';
            vm.showAlert = true;
            vm.$timeout(function(){
              vm.$uibModalInstance.dismiss();
            },4000);
          }
          else{
            vm.alert.message = res.message;
            vm.alert.type = 'danger';
            vm.showAlert = true;
          }
          vm.$log.debug('submit res .........', res);
        },
        function(res){
          vm.alert.message = 'Internal error try again later.';
          vm.alert.type = 'danger';
          vm.showAlert = true;
          vm.$log.debug('submit err .........', res);
        });*/
    }
  }

  /********************* cancel popup *************************/
  cancel (){
    this.$uibModalInstance.dismiss();
  }

}
