/**
 * Created by Fahad Saeed on 1/21/2016.
 */

export class MyActivitiesController {
  constructor (HttpService, global, $state ,$log) {
    'ngInject';
    let  vm = this;
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$state = $state;
    vm.$log = $log;
    vm.activate();
  }

  activate(){
    let vm = this;
    vm.busy = false;
    vm.page = 0;
    vm.activities = [];
  }

  /****************** Get Activities  ******************/
  getActivities(){
    let vm = this;
    vm.busy = true;
    vm.loading = true;
    (vm.HttpService.get('activities/me', {page : vm.page})).then(
      function(res){
        vm.loading = false;
        if(res.length){
          vm.activities = vm.activities.concat(res);
          vm.page++;
          vm.busy = false;
        }
        vm.$log.debug('activities res....', res);
      },
      function(err){
        vm.loading = false;
        vm.$log.debug('activities err....', err);
      });
  }

  /****************** single activity set unit and place  ******************/
  setActivity(activate){
    activate.placeIs = '';
    for(let i = 0 ; i < activate.places.length; i++){
      activate.placeIs = activate.placeIs + activate.places[i].name;
      if(activate.places.length > 1 && i != activate.places.length-1){
        activate.placeIs = activate.placeIs + ', ';
      }
    }
    //activate.priceUnit = activate.priceDetails.unit == 'PER_PERSON'? 'person' : 'reservation';
  }

  /****************** Change activity status  ******************/
  activityStatus(activity) {
    let vm = this,
      status = activity.active ? 'deactivate' : 'activate';
    activity.statusLoading = true;
    (vm.HttpService.get('activities/'+ activity.id + '/state/' + status )).then(
      function(res){
        if(res.returnCode == 200){
          activity.active = !activity.active;
        }
        activity.statusLoading = false;
        vm.$log.debug('activity status....', res);
      },
      function(){
        activity.statusLoading = false;
      });
  }

}
