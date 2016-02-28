/**
 * Created by Fahad Saeed on 12/28/2015.
 */

//Usage:
/* **************************************************
      <input-auto-complete
          placeholder="Select city"
          only="true"                         'Flag indicating that only tags coming from the autocomplete list will be allowed. When this flag is true, addOnEnter, addOnComma, addOnSpace and addOnBlur values are ignored.
          tags-array="vm.user.city"           'select value is equal to vm.user.city'
          max="1"                             'Allow set of tags"
          display="name"                      'Property to be rendered as the tag label.'
          conditions="{{vm.conditions}}">
          </input-auto-complete>
**************************************************** */



export function AutoCompleteDirective() {
  'ngInject';

  return {
    restrict: 'EA',
    templateUrl: 'app/components/autocomplete/autocomplete.html',
    scope: {
      tags: '=tagsArray',
      placeholder: '@',
      only: '@',
      max: '@',
      display: '@',
      conditions: '@conditions',
      add: '&',
      remove: '&',
      change: '=change'
    },

    controller: AutoCompleteController,
    controllerAs: 'vm',
    bindToController: true
    //link: AutoCompleteLink
  };
}

class AutoCompleteController {
  constructor (HttpService, $log, global,$timeout) {
    'ngInject';
    let vm = this;
    vm.tags = [];
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$log = $log;
    vm.$timeout = $timeout;
  }

  /*************** Load Request Suggestion List***************/
  load ($query) {
    let vm = this, url ;
    if(vm.conditions){
      vm.condition = angular.fromJson(vm.conditions);
      if($query){
        vm.loading = true;
       return (vm.HttpService.get(vm.condition.api, {text : $query})).then(
          function(res){
            vm.loading = false;
            if(res){
              if(vm.condition.api == 'activities/tags/findlike'){
                return  res.map(function(obj){
                          obj.id = obj.payload.id;
                            return obj;
                        });
              }
              if(vm.condition.api == 'places/cities/findlike' &&  vm.global.geolocation && vm.global.geolocation.latitude && vm.global.geolocation.longitude){
                 res.unshift({
                  id: 0,
                 loc : [vm.global.geolocation.latitude ,vm.global.geolocation.longitude],
                 name : 'Around me'
                 });
                return res;
              }
              else{
                return res
              }
            }
            else{
              if(vm.condition.api == 'places/cities/findlike' && vm.global.geolocation && vm.global.geolocation.latitude && vm.global.geolocation.longitude){
                return [{
                  id: 0,
                  loc : [vm.global.geolocation.latitude ,vm.global.geolocation.longitude],
                  name : 'Around me'
                }];
              }
              else{
                return []
              }
            }
          },
          function(){
            vm.loading = false;
          });
      }
      else{
          return [];
      }
    }
    else{
        return [];
    }
  }

  /*************** Before Adding Tag Call ***************/
  beforeAdding($tag) {
    let vm = this;
    if (vm.only == 'false' && vm.tags.length) {
      for (let i = 0; i < vm.tags.length; i++) {
        if ($tag[vm.display].toLowerCase() ==  ''+vm.tags[i].id.toLowerCase()) {
            vm.tags.splice(i, 1);
            break;
        }
      }
    }
  }

  /*************** After Add Tag Call ***************/
  TagAdd($tag){
    let vm = this;
    vm.change = $tag;
    if(!$tag.id){
      //$tag.id = Math.random()*7;
      $tag.id = $tag[vm.display];
    }
    vm.$timeout(function(){
      vm.add($tag);
    },100);
  }

  /*************** After Remove Tag Call ***************/
  TagRemove($tag){
    let vm = this;
    vm.change = $tag;
    vm.$timeout(function(){
      vm.remove($tag);
    },100);

  }
}

 //function AutoCompleteLink(scope, ele, attr){}
