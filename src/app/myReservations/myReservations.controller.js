/**
 * Created by Fahad Saeed on 1/26/2016.
 */


export class MyReservationsController {
  constructor (HttpService, global, $state ,$log, $uibModal) {
    'ngInject';
    let  vm = this;
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$state = $state;
    vm.$log = $log;
    vm.$uibModal = $uibModal;
    vm.activate();
  }

  activate(){
    let vm = this;
    vm.busy = false;
    vm.page = 0;
    vm.tab = 'all';
    vm.reservations = [];
    vm.getReservations();
  }


  /****************** Get Activities Controller load ******************/
  getReservations(){
    let vm = this;
    vm.busy = true;
    vm.loading = true;
    (vm.HttpService.get('reservations/me' , {page : vm.page , type : vm.tab})).then(
      function(res) {
        if(res.length){
          vm.reservations = vm.reservations.concat(res);
          vm.page++;
          vm.busy = false;
        }
        vm.loading = false;
        vm.$log.debug('reservations ...',vm.page , vm.tab ,res);
      },
      function(err){
        vm.loading = false;
        vm.$log.debug('reservations pending .. err....', err);
      });
  }


  /****************** Change Tab******************/
  changeTab(){
    this.reservations = [];
    this.page = 0;
    this.getReservations();
  }
}
