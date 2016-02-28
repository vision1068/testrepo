/**
 * Created by Fahad Saeed on 2/11/2016.
 */

export class HomeController {
  constructor (HttpService, $log, $state, global) {
    'ngInject';
    let  vm = this;
    vm.HttpService = HttpService;
    vm.$log = $log;
    vm.global = global;
    vm.$state = $state;
  }

}
