/**
 * Created by Fahad Saeed on 1/11/2016.
 */

export class SingleActivityController {
  constructor (HttpService, global, $state ,$log, $uibModal, Lightbox) {
    'ngInject';
    let  vm = this;
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$state = $state;
    vm.$log = $log;
    vm.$uibModal = $uibModal;
    vm.Lightbox = Lightbox;
    vm.activate();
  }

  activate(){
    let vm = this;
    vm.loading1 = true;
    vm.loading2 = true;
    vm.reservationsTab = 'pending';
    vm.id = this.$state.params.id;
    vm.reviewIs = 'activity';
    vm.getActivities();
    vm.getReservations();
  }

  /****************** Get Activities Controller load ******************/
  getActivities(){
    let vm = this;
    (vm.HttpService.get('activities/get/' + vm.id)).then(
      function(res) {
        if(res.returnCode == 200){
          vm.coverIs =  'url('+ res.payload.cover +')';
          vm.activities = res.payload;
          vm.calculateRatingAverage();
          if(vm.activities.owner){
            vm.changeTab();
          }
        }
        else{
          vm.$state.go('actiloo.my-activities')
        }
        vm.loading1 = false;
        vm.$log.debug('activities res....', vm.activities);
      },
      function(err){
        vm.$log.debug('activities err....', err);
      }
    );
  }


  /****************** Get All Reservations  Controller load ******************/
  getReservations(){
    let vm = this;
    (vm.HttpService.get('activities/'+ vm.id +'/reservations/all')).then(
      function(res) {
        vm.reservationsAll = res;
        vm.loading2 = false;
        vm.$log.debug('reservations all res....', res);

      },
      function(err){
        vm.$log.debug('reservations all err....', err);
      });
  }


  /****************** Open Popup Request Book if owner false  ******************/
  requestBook (){
    let vm = this;
    vm.$uibModal.open({
      templateUrl: 'app/singleActivity/requestBook/requestBook.html',
      size : 'lg',
      controller: 'RequestBookController',
      controllerAs: 'vm',
      resolve: {
        resolve: function () {
          return {
            activities : vm.activities,
            reservation : vm.reservations
          }
        }
      }
    });
  }


  /****************** Change activity status  ******************/
  changeStatus() {
    let vm = this,
      status = vm.activities.active ? 'deactivate' : 'activate';
    vm.statusLoading = true;
    (vm.HttpService.get('activities/'+ vm.activities.id + '/state/' + status )).then(
      function(res){
        !(res.returnCode == 200)  || ( vm.activities.active = !vm.activities.active);
        vm.statusLoading = false;
        vm.$log.debug('activity status....', res);
      },
      function(){
        vm.statusLoading = false;
      });
  }


  /****************** Change Tabs Reservations if owner true  ******************/
  changeTab(){
    let vm = this;
    vm.reservations = [];
    vm.reservationLoading = true;
    (vm.HttpService.get('activities/'+ vm.id +'/reservations/'+ vm.reservationsTab)).then(
      function(res) {
        vm.reservationLoading = false;
        if(res.length){
          vm.reservations = res;
        }
        vm.$log.debug('reservations .. res....', res);
      },
      function(err){
        vm.reservationLoading = false;
        vm.$log.debug('reservations pending .. err....', err);
      });
  }

  /****************** Change Reviews Tab  ******************/
  changeReviewsTab(){
    let vm = this;
    if(vm.reviewIs == 'user'){
       (vm.HttpService.get('users/'+ vm.activities.user.id + '/reviews' )).then(
       function(res) {
         if(res.length){
           vm.userReviews = res;
           vm.calculateRatingAverage()
         }
       vm.$log.debug('reviewIs res....', res);
       },
       function(err){
       vm.$log.debug('reviewIs err....', err);
       }
       );
    }
  }


  /****************** Calculate Reviews Rating Average  ******************/
 calculateRatingAverage() {
    let vm = this;
    let a =0,b=0,c=0, len=0;
    if(vm.activities.reviews && vm.activities.reviews.length){
      if(vm.reviewIs == 'user'){
        vm.userReviews.map(function(obj){
          a = a + obj.ponctuality;
          b = b + obj.flexibility;
          c = c + obj.communication;
        });
        len =  vm.userReviews.length
      }
      else{
        vm.activities.reviews.map(function(obj){
          a = a + obj.accuracy;
          b = b + obj.qos;
          c = c + obj.value;
        });
        len =  vm.activities.reviews.length;
      }
      vm.rating1  = a/len;
      vm.rating2  = b/len;
      vm.rating3  = c/len;
    }
  }

  openLightbox(images, index){
    this.Lightbox.openModal(images, index);
  }
}
