/* global malarkey:false, moment:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { AuthInterceptorFactory } from '../app/components/service/authInterceptor/authInterceptor.factory.js';
import { AuthService } from '../app/components/service/auth/auth.service.js';
import { HttpService } from '../app/components/service/http/http.service.js';
import { GlobalService } from '../app/components/service/global/global.service.js';
import { ActilooController } from '../app/actiloo/actiloo.controller.js';
import { SignUpController } from '../app/subscription/signup/signup.controller.js';
import { SignInController } from '../app/subscription/signin/signin.controller.js';
import { ConfirmController } from '../app/subscription/confirm/confirm.controller.js';
import { HomeController } from '../app/home/home.controller.js';
import { NewActivitiesController } from '../app/newActivities/newActivities.controller.js';
import { SingleActivityController } from '../app/singleActivity/singleActivity.controller.js';
import { RequestBookController } from '../app/singleActivity/requestBook/requestBook.controller.js';
import { MyActivitiesController } from '../app/myActivities/myActivities.controller.js';
import { MyReservationsController } from '../app/myReservations/myReservations.controller.js';
import { SingleReservationController } from '../app/singleReservation/singleReservation.controller.js';
import { PaymentController } from '../app/singleReservation/payment/payment.controller.js';
import { ConfirmationPopupController } from '../app/confirmationPopup/confirmationPopup.controller.js';
import { ReviewsController } from '../app/reviews/reviews.controller.js';
import { SearchController } from '../app/search/search.controller.js';
import { HeaderDirective } from '../app/components/header/header.directive.js';
import { FooterDirective } from '../app/components/footer/footer.directive.js';
import { AutoCompleteDirective } from '../app/components/autocomplete/autocomplete.directive.js';
import { SearchFormDirective } from '../app/components/searchForm/searchForm.directive.js';
import { ScrollShowHideDirective } from '../app/components/scrollShowHideContainer/scrollShowHideContainer.directive.js';
import { StickyDirective } from '../app/components/sticky/sticky.directive.js';
import { PopOverDirective } from '../app/components/popOver/popOver.js';
import { CurrenciesFilter } from '../app/components/filters/filters.js';
import { DateFilter } from '../app/components/filters/filters.js';
import { RemoveUnderscore } from '../app/components/filters/filters.js';
import { DateWithTime } from '../app/components/filters/filters.js';
import { StatusFilter } from '../app/components/filters/filters.js';
import { languageFilter } from '../app/components/filters/filters.js';
import { priceUnit } from '../app/components/filters/filters.js';
import  '../../bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js';

angular.module('actiloo',
  ['ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngMessages',
    'ngAria',
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'toastr',
    'ngTagsInput',
    'ngFileUpload',
    'pascalprecht.translate',
    'infinite-scroll',
    'bootstrapLightbox'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .filter('currenciesFilter', CurrenciesFilter)
  .filter('dateFilter', DateFilter)
  .filter('removeUnderscore', RemoveUnderscore)
  .filter('dateWithTime', DateWithTime)
  .filter('statusFilter', StatusFilter)
  .filter('languageFilter', languageFilter)
  .filter('priceUnit', priceUnit )
  .service('AuthInterceptorFactory', AuthInterceptorFactory)
  .service('AuthService', AuthService)
  .service('HttpService', HttpService)
  .service('global', GlobalService)
  .controller('ActilooController', ActilooController)
  .controller('SignUpController', SignUpController)
  .controller('SignInController', SignInController)
  .controller('ConfirmController', ConfirmController)
  .controller('HomeController', HomeController)
  .controller('NewActivitiesController', NewActivitiesController)
  .controller('SingleActivityController', SingleActivityController)
  .controller('RequestBookController', RequestBookController)
  .controller('MyActivitiesController', MyActivitiesController)
  .controller('MyReservationsController', MyReservationsController)
  .controller('SingleReservationController', SingleReservationController)
  .controller('PaymentController', PaymentController)
  .controller('ConfirmationPopupController', ConfirmationPopupController)
  .controller('ReviewsController', ReviewsController)
  .controller('SearchController', SearchController)
  .directive('actilooHeader', HeaderDirective)
  .directive('actilooFooter', FooterDirective)
  .directive('inputAutoComplete', AutoCompleteDirective)
  .directive('searchForm', SearchFormDirective)
  .directive('scrollShowHide', ScrollShowHideDirective)
  .directive('sticky', StickyDirective)
  .directive('actilooPopOver', PopOverDirective)
  .config( $httpProvider =>  {
    $httpProvider.interceptors.push('AuthInterceptorFactory');
  });
