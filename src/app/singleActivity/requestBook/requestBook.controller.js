/**
 * Created by Fahad Saeed on 1/13/2016.
 */


export class RequestBookController {
  constructor(HttpService, global, $log, resolve, moment, $uibModalInstance, $timeout) {
    'ngInject';
    let vm = this;
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$log = $log;
    vm.opened = false;
    vm.resolve = resolve;
    vm.moment = moment;
    vm.$uibModalInstance = $uibModalInstance;
    vm.$timeout = $timeout;
    vm.book = {activityId : vm.resolve.activities.id, messages: []};
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

    if(vm.resolve.activities.minParticipants == vm.resolve.activities.maxParticipants){
      vm.participantIs = [vm.resolve.activities.maxParticipants]
    }
    else{
      for (let i = vm.resolve.activities.minParticipants ; i < vm.resolve.activities.maxParticipants; i++) {
        vm.participantIs.push(i)
      }
    }
    vm.initialize()
  }

  /********************* initialize values *************************/
  initialize() {
    let vm = this,
        date = new Date();

    vm.currentDate = new Date();
    vm.participants = ''+ vm.participantIs[0];
    vm.startDate = {
      date : date.setDate(date.getDate() + 1),
      hr : vm.hr[0],
      min : vm.min[0]
    };
    vm.endDate = {
      date :'' ,
      hr : vm.hr[0],
      min : vm.min[0]
    };
    vm.book.place = vm.resolve.activities.places[0];
    vm.cancelPlan = vm.resolve.activities.cancelPlan.replace('_' , ' ').toLowerCase();
    vm.price = undefined;
    vm.alert = {};
    vm.showAlert= false;
  }

  /********************* Open date picker start date *************************/
  startDateOPen () {
    this.openedStartDate = true;
  }

  /********************* Open date picker end date *************************/
  endDateOPen () {
    this.openedEndDate = true;
  }

  closeAlert (){
    this.showAlert = false
  }

  /********************* Estimate price detail *************************/
  estimate (form){
    let vm = this;
    if(form.$valid){
      let queryString = {
        activityId : vm.resolve.activities.id,
        startDate  : vm.moment(vm.startDate.date).format("YYYY-MM-DD")+ '-' + (vm.startDate.hr == 'HH' ? 0 : vm.startDate.hr) + '-' +(vm.startDate.min == 'MM' ? 0 : vm.startDate.min) ,
        endDate  : vm.moment(vm.endDate.date).format("YYYY-MM-DD")+ '-' + (vm.endDate.hr == 'HH' ? 0 : vm.endDate.hr) + '-' +(vm.endDate.min == 'MM' ? 0 : vm.endDate.min) ,
        participants : vm.participants
      };

      (vm.resolve.activities.duration.type ==  'VARIABLE') || delete  queryString.endDate;
      (vm.resolve.activities.minParticipants != 0 && vm.resolve.activities.maxParticipants != 0) || delete  queryString.participants;

      (vm.HttpService.get('reservations/estimate',queryString)).then(
        function(res){
          if(res.returnCode == 200){
            vm.price = res.payload;
          }
        },
        function(res){
          vm.$log.debug('estimate err .........', res);
        });
    }
  }

  /********************* Submit Form *************************/
  submit (form){
    let vm = this;
    vm.submitted = true;

    if(form.$valid && vm.startDate.hr != 'HH' && vm.startDate.min != 'MM'){
      if(vm.resolve.activities.duration.type ==  'VARIABLE'){
       if (vm.endDate.date == '' || vm.endDate.hr == 'HH' || vm.endDate.min == 'MM'){
          return
        }
      }

      vm.book.startDate = vm.moment(vm.startDate.date).hour(vm.startDate.hr ).minute(vm.startDate.min).second(0).valueOf();
      vm.book.participants =  + vm.participants;

      (vm.HttpService.post('reservations/new', vm.book )).then(
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
        });
    }
  }

  /********************* cancel popup *************************/
  cancel (){
    this.$uibModalInstance.dismiss();
  }

}
