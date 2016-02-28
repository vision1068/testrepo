/**
 * Created by Fahad Saeed on 1/27/2016.
 */

export class SingleReservationController {
  constructor (HttpService, global, $state ,$log, moment, $timeout , $uibModal, $cookies, toastr) {
    'ngInject';
    let  vm = this;
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$state = $state;
    vm.$log = $log;
    vm.moment = moment;
    vm.$timeout = $timeout;
    vm.$uibModal = $uibModal;
    vm.$cookies  = $cookies;
    vm.toastr = toastr;
    vm.activate();
  }

  activate(){
    let vm = this;
    vm.id = this.$state.params.id;
    vm.getReservation();
    vm.user = JSON.parse(atob(atob(vm.$cookies.get('info'))));
  }

  /****************** Get All Reservations  Controller load ******************/
  getReservation(){
    let vm = this;
    vm.loading = true;
    (vm.HttpService.get('reservations/'+ vm.id)).then(
      function(res) {
        vm.loading = false;
        if(res.returnCode == 200){
          vm.reservation = res.payload;
          vm.coverIs =  'url('+ res.payload.activity.cover +')';
        }
        vm.$log.debug('reservations res....', vm.reservation);
      },
      function(err){
        vm.loading = false;
        vm.$log.debug('reservations  err....', err);
      }
    );
  }


  /****************** Edit Details if  vm.reservation.part == 'REQUESTER'  Start ******************/

  /****************** Show Details Form  ******************/
  editDetails() {
    let vm = this;
    !(vm.editDetailsAllow == undefined)|| vm.detailFormFill();
    vm.editDetailsAllow = true;
  }

  /****************** Detail Form fill  ******************/
  detailFormFill(){
    let vm = this;
    vm.copyReservation = angular.copy(vm.reservation);
    vm.updateDetails = {
      id : vm.copyReservation.id,
      version :  vm.copyReservation.version,
      place :  vm.copyReservation.activity.places[0]
    };
    vm.participantIs = [];
    vm.startDate = {};
    vm.endDate = {};
    vm.currentDate = new Date();
    vm.hr = ['HH'];
    vm.min = ['MM'];
    for (let i = 0; i < 60; i++) {
      let a = ''+ i;
      (a.length != 1) || (a = '0' + a );
      if(i < 24 ){
        vm.hr.push(a)
      }
      vm.min.push(a)
    }

    if(vm.copyReservation.activity.minParticipants == vm.copyReservation.activity.maxParticipants){
      vm.participantIs = [vm.copyReservation.activity.maxParticipants]
    }
    else{
      for (let i = vm.copyReservation.activity.minParticipants ; i <= vm.copyReservation.activity.maxParticipants; i++) {
        vm.participantIs.push(i)
      }
    }
    vm.updateDetails.participants = ''+ vm.participantIs[0];
    vm.startDate  = vm.getDate(vm.copyReservation.startDate);
    vm.endDate  = vm.getDate(vm.copyReservation.endDate);
  }

  /****************** Return start and end date   ******************/
  getDate(date){
    if(date){
      let temp  = new Date(date);
      return {
        date: temp,
        hr: ('' + temp.getHours()).length == 1 ? ('0' + temp.getHours() ) : ('' + temp.getHours()),
        min: ('' + temp.getMinutes()).length == 1 ? ('0' + temp.getMinutes() ) : ('' + temp.getMinutes())
      }
    }
    else{
      return {date : date,
        hr : this.hr[0] ,
        min :this.min[0]
      }
    }
  }

  /****************** Open date picker start date **********************/
  startDateOPen () {
    this.openedStartDate = true;
  }

  /****************** Open date picker end date *************************/
  endDateOPen () {
    this.openedEndDate = true;
  }

  /****************** Estimate Price Detail*************************/
  estimate (form){
    let vm = this;
    if(form.$valid){
      let queryString = {
        activityId : vm.copyReservation.activity.id,
        startDate  : vm.moment(vm.startDate.date).format("YYYY-MM-DD")+ '-' + (vm.startDate.hr == 'HH' ? 0 : vm.startDate.hr) + '-' +(vm.startDate.min == 'MM' ? 0 : vm.startDate.min) ,
        endDate  : vm.moment(vm.endDate.date).format("YYYY-MM-DD")+ '-' + (vm.endDate.hr == 'HH' ? 0 : vm.endDate.hr) + '-' +(vm.endDate.min == 'MM' ? 0 : vm.endDate.min) ,
        participants : vm.updateDetails.participants
      };

      (vm.copyReservation.activity.duration.type ==  'VARIABLE') || delete  queryString.endDate;
      (vm.copyReservation.activity.minParticipants != 0 && vm.copyReservation.activity.maxParticipants != 0) || delete  queryString.participants;

      (vm.HttpService.get('reservations/estimate',queryString)).then(
        function(res){
          if(res.returnCode == 200){
            vm.price = res.payload;
            vm.$log.debug('estimate res .........', res);

          }
        },
        function(err){
          vm.$log.debug('estimate err .........', err);
        });
    }
  }

  /****************** Detail Submit Form *************************/
  detailSubmit (form){
    let vm = this;
    vm.submitted = true;
    if(form.$valid && vm.startDate.hr != 'HH' && vm.startDate.min != 'MM'){
      if(vm.copyReservation.activity.duration.type ==  'VARIABLE'){
        if (vm.endDate.date == '' || vm.endDate.hr == 'HH' || vm.endDate.min == 'MM'){
          return
        }
        else{
          vm.updateDetails.endDate = vm.moment(vm.endDate.date).hour(vm.endDate.hr ).minute(vm.endDate.min).second(0).valueOf();
        }
      }
      vm.updateDetails.startDate = vm.moment(vm.startDate.date).hour(vm.startDate.hr ).minute(vm.startDate.min).second(0).valueOf();
      vm.reservationUpdate(vm.updateDetails, 'editDetailsAllow');
    }
  }

  /****************** Edit Details if  vm.reservation.part == 'REQUESTER'  End ******************/


  /****************** Edit Prices if  vm.reservation.part == 'PUBLISHER'  Start ******************/

  /****************** Show Prices Form  ******************/
  editPrices() {
    let vm = this;
    !(vm.editPricesAllow == undefined)|| vm.PricesFormFill();
    vm.editPricesAllow = true;
  }


  /****************** Prices Form fill  ******************/
  PricesFormFill(){
    let vm = this;
    vm.priceReservation = angular.copy(vm.reservation);
    vm.updatePrices = {
      id : vm.priceReservation.id,
      version :  vm.priceReservation.version,
      price  : vm.priceReservation.price
    };
  }

  /****************** Prices Submit fill  ******************/
  priceSubmit (){
    let vm = this;
    vm.submitted = true;
    !(vm.updatePrices.price) || vm.reservationUpdate(vm.updateDetails, 'editPricesAllow');
  }

  /****************** Edit Prices if  vm.reservation.part == 'PUBLISHER'  End ******************/


  /****************** Reservation Update ******************/
  reservationUpdate(payload, allow){
    let vm = this;
    vm.reservationUpdateLoading = true;
    (vm.HttpService.post('reservations/edit', payload )).then(
      function(res){
        vm.reservationUpdateLoading = false;
        if(res.returnCode == 200){
          vm.reservation.status = res.payload.status;
          vm[allow] = false;
          if(allow == 'editDetailsAllow'){
            vm.reservation.price = vm.price.price;
            vm.reservation.customerFees = vm.price.fees;
          }
        }
        else{
          vm.toastr.error(res.message || 'Internal error try again later.');
        }
        vm.$log.debug('submit res .........', res);
      },
      function(res){
        vm.toastr.error('Internal error try again later.');
        vm.reservationUpdateLoading = false;
        vm.$log.debug('submit err .........', res);
      }
    );
  }


  /****************** Confirmation Request ******************/
  confirmationRequest(button){
    let vm = this;
    vm.confirmationLoading = true;
    (vm.HttpService.get('reservations/requestconfirmation',{reservationId : vm.reservation.id , version : vm.reservation.version })).then(
      function(res){
        if(res.returnCode == 200){
          //!(vm.reservation.part == "PUBLISHER" && button == 'confirm') ||  vm.confirmed();
          !(vm.reservation.part == "REQUESTER" &&  button == 'payment') ||  vm.paymentPopup();
        }
        vm.confirmationLoading = false;
      },
      function(res){
        vm.confirmationLoading = false;
        vm.$log.debug('requestconfirmation err .........', res);
      }
    );
  }

  /****************** Confirmed ******************/
  confirmed() {
    let vm =  this;
    vm.confirmationLoading = true;
    (vm.HttpService.get('reservations/confirm',{reservationId : vm.reservation.id , version : vm.reservation.version })).then(
      function(res){
        vm.confirmationLoading = false;
        if(res.returnCode == 200){
          vm.$state.go(vm.$state.current.name , vm.$state.params, {reload: true});
        }
        else{
          vm.toastr.error(res.message);
        }
        vm.$log.debug('requestconfirmation .........', res);
      },
      function(res){
        vm.toastr.error("Internal Error Please try again later.");
        vm.confirmationLoading = false;
        vm.$log.debug('estimate err .........', res);
      }
    );
  }

  /****************** Payment Popup ******************/
  paymentPopup() {
    let vm = this;
    vm.$uibModal.open({
      templateUrl: 'app/singleReservation/payment/payment.html',
      size : 'lg',
      controller: 'PaymentController',
      controllerAs: 'vm',
      resolve: {
        resolve: function () {
          return vm.reservation;
        }
      }
    });
  }


  /****************** Confirmation Message Popup ******************/
  confirmationMessage(type) {
    let vm = this;
    vm.$uibModal.open({
      templateUrl: 'app/confirmationPopup/confirmationPopup.html',
      size : 'lg',
      controller: 'ConfirmationPopupController',
      controllerAs: 'vm',
      windowClass : 'confirmation-popup',
      resolve: {
        resolve: {
          heading : vm.reservation.activity.name,
          message : "Are you sure you want to " + type  + " this Reservation?",
          type : type,
          reservation : vm.reservation
        }
      }
    });
  }

  /****************** Invoice ******************/
  invoice() {
    this.$log.debug('invoice call .........');
  }

  /****************** Message send  ******************/
  send() {
    let vm = this;
    vm.messageSubmitted = true;
    if(vm.text){
      vm.sendLoading = true;
      let payload = {
        text : vm.text,
        last : (vm.reservation.messages && vm.reservation.messages.length ) ? vm.reservation.messages[0].id : null
      };
      (vm.HttpService.post('reservations/message/new', payload, {reservationId : vm.reservation.id})).then(
        function(res){
          vm.messageSubmitted = false;
          vm.sendLoading = false;
          if(res.payload.length){
            vm.text = '';
            vm.reservation.messages = (vm.reservation.messages && vm.reservation.messages.length) ? res.payload.concat(vm.reservation.messages) : res.payload ;
          }
        },
        function(err){
          vm.sendLoading = false;
          vm.$log.debug('message send res .........', err);
        }
      );
    }
  }


  /****************** Filter apply class in filter  ******************/
  messageClass(message){
    let vm =  this;
    if(vm.user){
      switch (message.type) {
        case "NEW_MESSAGE":
          message.classes =  (message.user.id ==  vm.user.id) ? 'sender primary slideInLeft' : 'receiver  white slideInRight';
          break;
        case "CLIENT_CONFIRMED":
        case "OWNER_CONFIRMED":
          message.classes =  (message.user.id == vm.user.id) ? 'sender success slideInLeft' : 'receiver  success slideInRight';
          message.text = 'I Confirmed the Reservation';
          break;
        case "NEW_REQUEST":
          message.classes =  (message.user.id == vm.user.id) ? 'sender info slideInLeft' : 'receiver  info slideInRight';
          message.text = 'I made a new Request to Book';
          break;
        case "CANCELLED":
          message.classes =  (message.user.id == vm.user.id) ? 'sender danger slideInLeft' : 'receiver  danger slideInRight';
          message.text = 'I Canceled the Request';
          break;
        case "REJECTED":
          message.classes =  (message.user.id == vm.user.id) ? 'sender danger slideInLeft' : 'receiver  danger slideInRight';
          message.text = 'I Rejected the Request';
          break;
        case "OWNER_MODIFICATION":
          message.classes =  (message.user.id == vm.user.id) ? 'sender info slideInLeft' : 'receiver  info slideInRight';
          message.text = 'I made an offer. Please check and Confirm the price';
          break;
        case "CLIENT_MODIFICATION":
          message.classes =  (message.user.id == vm.user.id) ? 'sender info slideInLeft' : 'receiver  info slideInRight';
          message.text = 'I have modified the Request details. Please check and Confirm.';
          break;
        default:
          message.classes =  (message.user.id ==  vm.user.id) ? 'sender primary slideInLeft' : 'receiver  white slideInRight';
          break;
      }
    }
  }
}
