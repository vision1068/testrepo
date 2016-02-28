/**
 * Created by Fahad Saeed on 2/16/2016.
 */

export class SearchController {
  constructor (HttpService, $log, $state, global, $scope, $timeout) {
    'ngInject';
    let  vm = this;
    vm.HttpService = HttpService;
    vm.$log = $log;
    vm.global = global;
    vm.$scope = $scope;
    vm.$timeout = $timeout;
    vm.$state = $state;
    vm.view = 'grid';
    vm.params = {
      lon: vm.$state.params.lon,
      lat: vm.$state.params.lat,
      text: vm.$state.params.text,
      page : 0
    };
    vm.getFilters();
    vm.activate();
  }

  activate(){
    let vm = this;
    vm.busy = false;
    //vm.page = 0;
    vm.activities = [];

  }

  /*************** Search Activity ***************/
  searchActivity(){
    let vm = this;
    vm.busy = true;
    vm.loading = true;
    console.log('searchActivity ...',vm.filterActivityLoading, vm.params);
    (vm.HttpService.get('activities/search', vm.params )).then(
      function(res){
        vm.loading = false;
        if(res.hits.length){
          if(vm.filterActivityLoading){
            vm.activities = res.hits;
            vm.filterActivityLoading = false;
          }
          else{
            vm.activities = vm.activities.concat(res.hits);
          }
          vm.$log.debug('activities search res....', vm.activities.length);
          vm.params.page++;
          vm.busy = false;
        }
      },
      function(err){
        vm.loading = false;
        vm.$log.debug('activities search err....', err);
      });
  }

  /*************** Get Type a head tags ***************/
  getFilters(){
    let vm = this;
    vm.filterLoading = true;
    (vm.HttpService.get('activities/search/filters', {lon: vm.$state.params.lon, lat : vm.$state.params.lat,  text : vm.$state.params.text}  )).then(
      function(res){
        vm.filterLoading = false;
        if(res){
          vm.filters = res;
          vm.filtersIds  = {};
          for(let obj in res){
            if(res[obj].buckets.length){
              vm.filtersIds[obj] =  res[obj].buckets.map(function(o){
                o.select = true;
                return o.key
              })
            }
          }
          vm.copyFiltersIds = angular.copy(vm.filtersIds);
          vm.$log.debug('vm.filters....', angular.copy(res));
        }
      },
      function(){
        vm.filterLoading = false;
      });
  }

  /*************** Set single Activity Object ***************/
  setActivity(activate) {
    activate.placeIs = '';
    activate.activityInfo ={};

    for(let key in activate.info){
      if(key.indexOf('name') == -1){
        activate.activityInfo.text = activate.info[key]
      }
      else{
        activate.activityInfo.title = activate.info[key]
      }
    }
    if(activate.places.length){
      activate.places.map(function(obj , i){
        activate.placeIs = activate.placeIs + obj.name;
        if(activate.places.length > 1 && i != activate.places.length-1){
          activate.placeIs = activate.placeIs + ', ';
        }
      });
    };
  }

  /*************** Get user Info on mouse over ***************/
  getUserInfo(user){
    let vm = this;
    console.log('user hover', user.id);
    if(!user.getInfo){
      user.loading = true;
      (vm.HttpService.get('users/preview/'+ user.id )).then(
        function(res){
          user.loading = false;
          if(res){
            user.getInfo = res;
            vm.$log.debug('user.getInfo....', res);
          }
        },
        function(){
          user.loading = false;
        });
    }
  }

  //  GET /activities/search
  //?lon={{longitude}}
  //&lat={{latitude}}
  //&text={{enteredText}}
  //&categories={{ListOfCheckedCategoriesIds_SepratedByComma}}
  //&cancelPlans={{ListOfCheckedCancelPlansIds_SepratedByComma}}
  //&laguages={{ListOfCheckedLanguagesIds_SepratedByComma}}
  //&services={{ListOfCheckedLinkedServicesIds_SepratedByComma}}

  /*************** Filter Search Activity ***************/
  filterActivities(key, filter){
    let vm = this;
    if(filter.select){
      console.log('push');
      vm.filtersIds[key].push(filter.key);
    }
    else{
      console.log('splice');
      vm.filtersIds[key].splice(vm.filtersIds[key].indexOf(filter.key) , 1);
    }

    vm.params = {
      lon: vm.$state.params.lon,
      lat: vm.$state.params.lat,
      text: vm.$state.params.text,
      page : 0
    };

    if(vm.copyFiltersIds.categories.length != vm.filtersIds.categories.length ||
      vm.copyFiltersIds.cancelPlan.length != vm.filtersIds.cancelPlan.length ||
      vm.copyFiltersIds.languages.length != vm.filtersIds.languages.length ||
      vm.copyFiltersIds.included.length != vm.filtersIds.included.length) {

      vm.params.categories = vm.filtersIds.categories.toString();
      vm.params.cancelPlans = vm.filtersIds.cancelPlan.toString();
      vm.params.laguages = vm.filtersIds.languages.toString();
      vm.params.services = vm.filtersIds.included.toString();
    }

    vm.busy = false;
    vm.filterActivityLoading = true;
    vm.searchActivity();
  }



}

