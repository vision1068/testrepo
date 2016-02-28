/**
 * Created by Fahad Saeed on 12/22/2015.
 */

export class SignUpController {
  constructor (HttpService, global, $state, toastr) {
    'ngInject';
    let  vm = this;
    vm.months = ['Months', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    vm.days = ['Days', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30, 31];
    vm.years = ['Years'];
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$state = $state;
    vm.toastr = toastr;
    vm.conditions = {
      api : 'places/cities/findlike'
    };
    vm.conditionsLanguage = {
      api : 'languages/findlike'
  };

    for (var i = new Date().getFullYear() + 1; i > 1990 - 100; i--) {
      vm.years.push(i - 1);
    }
    vm.genders = [
      {value : 'Gender' , label : 'Gender'} ,
      {value : 'M' , label : 'Male'} ,
      {value : 'F' , label : 'Female'} ];
    vm.activate();
  }

  activate() {
    let vm = this;
    vm.user = {
      birthDate : {}
    };
    vm.month =  vm.months[0];
    vm.day = vm.days[0];
    vm.year = vm.years[0];
    vm.user.gender = vm.genders[0].value;
  }

 /******************** Sign up form ********************/
 signUp(form) {
    let vm = this;
    vm.submitted = true;
   if(form.$valid &&
      vm.month != 'Months' &&
      vm.day != 'Days' &&
      vm.year != 'Years'&&
      vm.user.gender != 'Gender'&&
      vm.city.length &&
      vm.user.password == vm.confirmPassword &&
     !vm.passwordError)
   {
      vm.user.birthDate.day = +vm.day;
      vm.user.birthDate.year = +vm.year;
      vm.user.birthDate.month = vm.months.indexOf(vm.month);
      vm.user.city = vm.city[0];
      vm.loading = true;
     (vm.HttpService.post('auth/signup',vm.user)).then(
        function(res){
          vm.loading = false;
          if(res.returnCode == 200){
            vm.global.confirm = res.payload;
            vm.$state.go('actiloo.subscription.confirm');
          }
          else{
            vm.toastr.error(res.message);
          }
        },
        function(err){
          vm.toastr.error(err.message);
          vm.loading = false;
        }
      );
    }
  }


  /*************************/
  passwordValidation(){
    this.passwordError = false;
    if(this.user.password && this.user.password.length){
      let exp = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
      !(this.user.password.length < 6)  || (this.passwordError  = "Password must be at least 6 characters");
      !(this.user.password.length > 25) || (this.passwordError  = "Password too long maximum 25 characters");
      (this.user.password.match(exp)) || (this.passwordError  = "Must contain at least 1 digit from 0-9 and 1 alphabetic character");
    }
  }
}
