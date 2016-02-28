/**
 * Created by Fahad Saeed on 1/20/2016.
 */

export function FooterDirective() {
  'ngInject';

  return  {
    restrict: 'E',
    templateUrl: 'app/components/footer/footer.html',
    scope: {},
    controller: FooterController,
    controllerAs: 'vm',
    bindToController: true
  };

}

class FooterController {
  constructor (global,  HttpService, $translate, $state) {
    'ngInject';
    let vm = this;
    vm.global = global;
    vm.HttpService = HttpService;
    vm.$translate = $translate;
    vm.$state = $state;
    vm.active();

  }

  active(){
    let vm = this;
    vm.languages = [
      {lang : 'English' , code : 'en'} ,
      {lang : 'Français' , code : 'fr'} ,
      {lang : 'Español' , code : 'es'}];

    vm.language = vm.global.locale || vm.languages[0].code;
    vm.currencies = ['USD', 'EUR', 'GBP'];
    vm.currency = vm.currencies[0];
  }

  locale() {
    let vm = this;
    vm.global.locale = vm.language;
    vm.$translate.use(vm.language);
    vm.$state.go(vm.$state.current.name , vm.$state.params, {reload: true});
  }
}
