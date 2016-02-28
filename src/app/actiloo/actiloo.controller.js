export class ActilooController {
  constructor (toastr, global) {
    'ngInject';
    let vm = this;
    vm.global = global;
    vm.toastr = toastr;
    vm.activate();
  }

  activate() {
    let vm = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position){
        vm.global.geolocation  = position.coords ;
      });
    }
  }
}
