/**
 * Created by Fahad Saeed on 2/23/2016.
 */

export function SearchFormDirective() {
  'ngInject';

  return  {
    restrict: 'E',
    templateUrl: 'app/components/searchForm/searchForm.html',
    scope: {},
    controller: SearchFormController,
    controllerAs: 'vm',
    bindToController: true
  };

}

class SearchFormController {
  constructor (global,  HttpService, $state, $window) {
    'ngInject';
    let vm = this;
    vm.global = global;
    vm.HttpService = HttpService;
    vm.$state = $state;
    vm.$window = $window;
    vm.autocompletePlaces = {
      api : 'places/cities/findlike'
    };
  }

  /*************** Get Type a head tags ***************/
  getTags(text){
    let vm = this;
    return (vm.HttpService.get('activities/tags/findlike', {text : text})).then(
      function(res){
        vm.loading = false;
        if(res){
          return res.map(function(item){
            return item.text;
          });
        }
      },
      function(){
        vm.loading = false;
      });
  }


  /*************** Redirect Search Page ***************/
  search(){
    let vm = this;
    vm.submitted = true;
    if(vm.where.length){
      vm.$state.go('actiloo.activities-search', {lat : vm.where[0].loc[1] ,lon :vm.where[0].loc[0] , text : vm.tags})
    }
  }

    addTag(){
            angular.element('.search-form .typeahead-input').find('input').focus();
    }

}
