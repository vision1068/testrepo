/**
 * Created by Fahad Saeed on 2/4/2016.
 */

export class ReviewsController {
  constructor ($state, HttpService, Upload, $log, toastr, $timeout) {
    'ngInject';
    let vm = this;
    vm.$state = $state;
    vm.HttpService = HttpService;
    vm.Upload = Upload;
    vm.$log = $log;
    vm.toastr = toastr;
    vm.$timeout =  $timeout;
    vm.activate();
  }

  activate() {
    let vm = this;
    vm.payload = {
      user :{}
    };
    vm.getReviews();
    vm.files = [];
  }

  /**************************** Get Reservation Details *******************************/
  getReviews(){
    let vm = this;
    vm.loading = true;
    (vm.HttpService.get('reservations/review/' +vm.$state.params.reservationId )).then(
      function(res){
        vm.loading = false;
        vm.reviews = res.payload;
        vm.$log.debug('review res....', res);
      },
      function(err){
        vm.loading = false;
        vm.$log.debug('review err....', err);
      }
    );
  }

  /**************************** Upload image select *******************************/
  upload(files, errFiles) {
    let vm = this;
    if((vm.files.length + files.length) <= 5){
      vm.files = vm.files.concat(files);
      vm.errFiles = errFiles;
      angular.forEach(files, function(file) {
        file.upload = vm.Upload.upload({
          url: 'http://linkexp.ddns.net/actiloo/upload/images',
          data: {file: file}
        });
        file.upload.then(function (response) {
          vm.$timeout(function () {
            file.fileName = response.data[0].fileName;
          });
        }, function (response) {
          !(response.status > 0) || vm.toastr.error(response.status + ': ' + response.data);
        }, function (evt) {
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
      });
    }
    else{
      vm.toastr.error('Maxmimum upload up to 5 photos');
    }
  }

  /**************************** Remove select image in  array *******************************/
  removeImage(index){
    this.files.splice(index,1)
  }

  /**************************** Reviews Submit *******************************/
  submit(form){
    let vm = this;
    vm.submitted = true;
    if(form.$valid){
      vm.submitLoading = true;
      if(vm.reviews.part == 'REQUESTER' &&  vm.files.length){
        vm.payload.activity.photos = vm.files.map(function(obj){
          return obj.fileName;
        });
      }
      (vm.HttpService.post('reservations/review/' + vm.$state.params.reservationId, vm.payload)).then(
        function(res){
          vm.submitLoading = false;
          if(res.returnCode == 200){
            vm.toastr.success("Thanks for your feedback!");
            vm.$state.go('actiloo.single-reservation' ,  { id: vm.$state.params.reservationId})
          }
          else{
            vm.toastr.error(res.message);
          }
          vm.$log.debug(' res....', res);
        },
        function(err){
          vm.$log.debug(' err....', err);
          vm.toastr.error("Error");
          vm.submitLoading = false;
        }
      );
    }
  }

}
