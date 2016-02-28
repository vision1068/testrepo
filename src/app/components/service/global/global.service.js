
/**
 * Created by Fahad Saeed on 12/26/2015.
 */


export class GlobalService {
  constructor ($cookies) {
    'ngInject';
    let vm = this;
    vm.$cookies = $cookies;
    vm.data = {
      user : {},
      confirm : {},
      locale : 'en'
      }
  }

  /*user information*/
  //user() {
  //  return this.data.user;
  //}
  //
  //confirm() {
  //  return this.data.confirm;
  //}

  /*user login or not*/
  isLogin(){
  return !!this.$cookies.get('token-actiloo');
  }



}
