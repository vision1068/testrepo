/**
 * Created by Fahad Saeed on 1/1/2016.
 */

export class NewActivitiesController {
  constructor (HttpService, global, $state ,$log, Upload, toastr, $timeout) {
    'ngInject';
    let  vm = this;
    vm.HttpService = HttpService;
    vm.global = global;
    vm.$state = $state;
    vm.$log = $log;
    vm.toastr = toastr;
    vm.Upload = Upload;
    vm.$timeout = $timeout;
    vm.editPage = vm.$state.current.name == 'actiloo.edit-activity';
    vm.payload = {
      id : null,
      priceDetails : {},
      duration : {},
      categories : [],
      includedServices : []
    };
    vm.autocompletelanguages = {
      api : 'languages/findlike'
    };
    vm.autocompleteLocations = {
      api : 'places/cities/findlike'
    };
    vm.autocompleteTags = {
      api : 'activities/tags/findlike'
    };


    /********************** Condition check Activity edit or not **********************/
    if(vm.editPage){
      (vm.HttpService.get('activities/edit/' + vm.$state.params.id)).then(
        function(res) {
          if(res.returnCode ==200){
            vm.editActivity = res.payload;
            vm.editFormFill();
            vm.$log.debug('edit activities....', vm.editActivity);
          }
        },
        function(err){
          vm.$log.debug('activities err....', err);
        });

    }
    vm.activate();
  }

  activate(){
    let vm = this;
    vm.countMin = [];
    vm.countMax = [];
    for(let i = 0; i <= 200 ; i++ ){
      vm.countMin.push(i);
      vm.countMax.push(i);
    }

    vm.times = ["HOUR", "DAY", "WEEK", "MONTH"];
    vm.priceUnitOption1 = [{id : "PER_PERSON", label:"Per Person"},{id : "PER_RESERVATION", label:"Per Book"}];
    vm.priceUnitOption2 = [{id : "PER_RESERVATION", label:"Per Book"}];
    vm.priceUnit = vm.priceUnitOption1;
    vm.frequencyUnitOption = [{id : "HOUR", label:"Per Hour"},{id : "DAY", label:"Per Day"},{id : "WEEK", label:"Per Week"},{id : "MONTH", label:"Per Month"}];
    vm.frequencyUnit = [{id : "PACKAGE", label:"Per Book"}];
    vm.getCategories();
    vm.getCurrencies();
    /********************** Condition check  add new activity **********************/
    if(!vm.editPage){
      vm.payload.priceDetails = {
        unit : vm.priceUnit[0].id,
        frequency :  vm.frequencyUnit[0].id,
        currency : ''
      };
      vm.payload.duration = {type : 'NA'};
      vm.payload.categories = [];
      vm.payload.includedServices = [];
      vm.minParticipants  = '1';
      vm.maxParticipants  = '1';

      vm.fixedMinDurationUnit = vm.times[0];
      vm.variableMinDurationUnit = vm.times[0];
      vm.variableMaxDurationUnit = vm.times[0];
      vm.categoriesSelected = [];
      vm.services = [];
      vm.getServices();
    }
  }

  /****************** Set Values of Participants  ******************/
  setMaxParticipants(){
    let vm = this;
    vm.countMax = angular.copy(vm.countMin);
    vm.countMax.splice(0, vm.minParticipants);
    if(+vm.minParticipants > +vm.maxParticipants){
      vm.maxParticipants  =  ''+vm.countMax[0];
    }
  }

  /****************** Get Categories  ******************/
  getCategories(){
    let vm = this;
    (vm.HttpService.get('categories/all')).then(
      function(res){
        if(res.length){
          vm.categories = res;
          !(vm.editActivity && vm.editActivity.categories) || vm.editCategoriesChecked();
        }
      },
      function(err){
        vm.$log.debug('categories err....', err);
      });
  }


  /****************** Get Currencies  ******************/
  getCurrencies(){
    let vm = this;
    (vm.HttpService.get('static/currencies')).then(
      function(res){
        !res || (vm.currenciesUnit = res);
        vm.payload.priceDetails.currency = vm.currenciesUnit[0];
      },
      function(err){
        vm.$log.debug('static err....', err);
      });
  }


  /****************** Get Services  ******************/
  getServices(){
    let vm = this;
    (vm.HttpService.get('services/all')).then(
      function(res){
        if(res){
          vm.services = res;
        }
      },
      function(err){
        vm.$log.debug('services err....', err);
      });
  }


  /****************** Edit Activity fill field ******************/
  editFormFill(){
    let vm = this ;
    vm.coverIs =  'url('+ vm.editActivity.cover +')';
    if(vm.editActivity.minParticipants == 0 &&  vm.editActivity.maxParticipants == 0){
      vm.applicable = true;
      vm.checkApplicable(true);
    }
    vm.payload.id = vm.$state.params.id;
    vm.payload.cover = vm.editActivity.cover;
    vm.payload.places = vm.editActivity.places;
    vm.tags = vm.editActivity.tags.map(function(tag){
      return {id : tag , text : tag }
    });
    vm.minParticipants = ''+vm.editActivity.minParticipants;
    vm.maxParticipants = ''+vm.editActivity.maxParticipants;
    vm.payload.status = vm.editActivity.active;
    vm.payload.duration  = {type : vm.editActivity.duration.type};
    vm.payload.priceDetails = vm.editActivity.priceDetails;
    vm.payload.cancelPlan = vm.editActivity.cancelPlan;
    vm.payload.categories = vm.editActivity.categories;
    vm.payload.paymentModality = vm.editActivity.paymentModality;
    vm.languages = vm.editActivity.languages;
    if(vm.languages.length && vm.editActivity.translations.length){
      for(let i=0; i < vm.editActivity.translations.length; i++){
        for(let j=0; j < vm.languages.length; j++) {
          if(vm.editActivity.translations[i].language.id == vm.languages[j].id){
            vm.languages[j].title = vm.editActivity.translations[i].name;
            vm.languages[j].desc = vm.editActivity.translations[i].desc;
          }
        }
      }
    }
    if(vm.editActivity.duration.type == "FIXED"){
      vm.fixedMinDuration = vm.editActivity.duration.minDuration;
      vm.fixedMinDurationUnit = vm.editActivity.duration.minDurationUnit;
    }
    if(vm.editActivity.duration.type == "VARIABLE"){
      vm.variableMinDuration = vm.editActivity.duration.minDuration;
      vm.variableMinDurationUnit = vm.editActivity.duration.minDurationUnit;
      vm.variableMaxDuration = vm.editActivity.duration.maxDuration;
      vm.variableMinDurationUnit = vm.editActivity.duration.maxDurationUnit;
      //vm.variableMaxDurationUnit = vm.editActivity.duration.maxDurationUnit;
    }
    vm.services =  vm.editServicesFill(vm.editActivity.includedServices);
    vm.editCategoriesChecked();
  }


  /****************** Edit Categories Checked ******************/
  editCategoriesChecked() {
    let vm = this;
    if(vm.editActivity && vm.categories && vm.editActivity.categories.length && vm.categories.length && !vm.autoCheckFlag){
      vm.autoCheckFlag = true;
      vm.categoriesSelected = angular.copy(vm.categories);
      for(let j = 0; j < vm.editActivity.categories.length; j++){
        for(let i = 0; i < vm.categories.length; i++){
          if(vm.categories[i].name == vm.editActivity.categories[j].name){
            vm.categoriesSelected[i].select = true;
          }
        }
      }
    }
  }


  /****************** Edit Services Included or not include filed set one by one ******************/
  editServicesFill(services){
    return angular.copy(services).map(function(obj){
      let temp = obj.service;
      temp.comment = obj.comment;
      temp.inCharge = obj.inCharge;
      temp.language =  obj.translations.map(function(lang){
        let language = lang.language;
        language.text = lang.text;
        return language
      });
      return temp;
    });
  }


  /****************** Participants needed or not ******************/
  checkApplicable (applicable) {
    let vm = this;
    vm.countMax = angular.copy(this.countMin);
    if(applicable){
      vm.minParticipants  = '0';
      vm.maxParticipants = '0';
      vm.priceUnit = vm.priceUnitOption2;
      vm.payload.priceDetails.unit= vm.priceUnitOption2[0].id;
    }
    else{
      vm.minParticipants  = '1';
      vm.maxParticipants = '1';
      vm.priceUnit = vm.priceUnitOption1;
    }
  }


  priceDetailsCheckRules(){
    let vm = this;
    if(vm.payload.duration.type == 'NA'){
      vm.frequencyUnit = [{id : "PACKAGE", label:"Per Book"}];
    }
    else{
      let temp = vm.payload.duration.type == 'FIXED' ? vm.fixedMinDurationUnit : vm.variableMinDurationUnit;
      vm.frequencyUnit = [{id : "PACKAGE", label:"Per Book"}];
      for(let i = 0 ; i < vm.frequencyUnitOption.length; i++){
        if(temp == vm.frequencyUnitOption[i].id){
          vm.frequencyUnit.push(vm.frequencyUnitOption[i]);
        }
      }
    }
  }

  /****************** Set payload data before send*****************/
  checkForm (){
    let vm = this ,
      languages = angular.copy(vm.languages);

    vm.payload.translations =  languages.map(function(obj){
      let temp = {
        name : obj.title,
        desc : obj.desc,
        language : obj
      };
      delete temp.language.title;
      delete temp.language.desc;
      return temp
    });

    vm.payload.languages = vm.payload.translations.map(function(obj){
      return obj.language
    });

    if(vm.payload.duration.type == 'FIXED'){
      vm.payload.duration.minDuration =  vm.fixedMinDuration;
      vm.payload.duration.minDurationUnit =  vm.fixedMinDurationUnit;
      vm.payload.duration.maxDuration =  vm.fixedMinDuration;
      vm.payload.duration.maxDurationUnit =  vm.fixedMinDurationUnit;
    }
    if(vm.payload.duration.type == 'VARIABLE'){
      vm.payload.duration.minDuration =  vm.variableMinDuration;
      vm.payload.duration.minDurationUnit =  vm.variableMinDurationUnit;
      vm.payload.duration.maxDuration =  vm.variableMaxDuration;
      vm.payload.duration.maxDurationUnit =  vm.variableMinDurationUnit;
    }
    if(vm.payload.duration.type == 'NA'){
      delete vm.payload.duration.minDuration ;
      delete vm.payload.duration.minDurationUnit;
      delete vm.payload.duration.maxDuration;
      delete vm.payload.duration.maxDurationUnit;
    }

    vm.payload.includedServices = vm.service(vm.services);
    vm.payload.minParticipants = +vm.minParticipants;
    vm.payload.maxParticipants = +vm.maxParticipants;
    vm.payload.tags = vm.tags.map(function(obj) {
      return obj.text;
    });
  }


  /****************** Set Service payload data before send*****************/
  service(objServices ){
    return  angular.copy(objServices).map(function(obj){
      let temp = {
        translations :
          obj.language.map(function(lang){
            let a = {
              language : lang,
              text :lang.text
            };
            delete a.language.text;
            return a
          }),
        inCharge : obj.inCharge,
        service : obj
      };
      delete temp.service.comment;
      delete temp.service.inCharge;
      delete temp.service.language;
      return temp
    });
  }


  /**************************** Upload image select *******************************/
  upload ($files) {
    let vm = this;
    vm.uploadLoading = true;
    this.Upload.upload({
      url: 'http://linkexp.ddns.net/actiloo/upload/images',
      data: {file: $files}
    }).then(function (res) {
      vm.uploadLoading = false;
      if(res.status == 200){
        !res.data.length || (vm.payload.cover = res.data[0].fileName);
        vm.coverIs =  'url('+ vm.payload.cover +')';
      }
    }, function () {
      vm.uploadLoading = false;
    })
  }


  /************************ Categories checked unchecked  ************************/
  checkedCategory(isChecked, category) {
    let vm = this,
      flag = false;
    if(isChecked){
      if(vm.payload.categories.length){
        for(let i = 0; i < vm.payload.categories.length; i++ ){
          if(category.id == vm.payload.categories[i].id){
            flag = true;
            break;
          }
        }
        flag || vm.payload.categories.push(category);
      }
      else{
        vm.payload.categories.push(category);
      }
    }
    else{
      for(let i = 0; i < vm.payload.categories.length; i++ ){
        if(category.id == vm.payload.categories[i].id){
          vm.payload.categories.splice(i, 1);
        }
      }
    }
  }


  /************************ Form Submit  ************************/
  submit (form){
    let vm = this;
    vm.submitted = true;
    if(form.$valid &&
      vm.payload.cover &&
      vm.languages.length &&
      vm.payload.status != undefined &&
      vm.payload.places.length &&
      vm.tags.length &&
      !!vm.payload.cancelPlan &&
      //!!vm.payload.paymentModality  &&
      vm.payload.categories.length
    ){
      vm.checkForm();
      vm.loading = true;
      (vm.HttpService.post('activities/save',vm.payload)).then(
        function(res){
          vm.loading = false;
          if(res.returnCode == 200){
            vm.toastr.success("Activities Saved!");
            vm.$state.go('actiloo.my-activities');
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
    else{
      vm.$timeout(function(){
        angular.element('body').animate({
          scrollTop: ((angular.element('.has-error').first().offset().top) - 100)
        },500);
      });
      vm.toastr.error('Awesome! Almost there, but these fields are required.');
    }
  }


  /****************** Language add and remove services in add and remove object start ******************/
  addLanguage (){
    this.servicesLanguageAdd(this.services);
  }

  removeLanguage (){
    this.servicesLanguageRemove(this.services);
  }

  servicesLanguageAdd (services) {
    for(let i = 0 ; i < services.length ; i++){
      services[i].language  || (services[i].language = []);
      services[i].language.push(angular.copy(this.change));
    }
  }

  servicesLanguageRemove (services) {
    for(let i = 0 ; i < services.length ; i++){
      for(let j = 0 ; j < services[i].language.length ; j++){
        if(services[i].language[j].id == this.change.id){
          services[i].language.splice(j , 1)
        }
      }
    }
  }
  /****************** Language add and remove services in add and remove object end ******************/

}
