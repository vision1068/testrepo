export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('actiloo', {
      abstract: true,
      templateUrl: 'app/actiloo/actiloo.html',
      controller: 'ActilooController',
      controllerAs: 'vm'
    })
    .state('actiloo.subscription', {
      abstract: true,
      templateUrl: 'app/subscription/subscription.html',
      controller: 'SignInController',
      controllerAs: 'vm'
    })
    .state('actiloo.subscription.signin', {
      url: '/signin',
      templateUrl: 'app/subscription/signin/signin.html'

    })
    .state('actiloo.subscription.signup', {
      url: '/signup',
      templateUrl: 'app/subscription/signup/signup.html',
      controller: 'SignUpController',
      controllerAs: 'vm'
    })
    .state('actiloo.subscription.confirm', {
      url: '/confirm',
      templateUrl: 'app/subscription/confirm/confirm.html',
      controller: 'ConfirmController',
      controllerAs: 'vm'
    })
    .state('actiloo.home', {
      url: '/',
      templateUrl: 'app/home/home.html',
      controller: 'HomeController',
      controllerAs: 'vm',
      authenticate : 'admin'
    })
    .state('actiloo.activities-search', {
      url: "/search?lon&lat&text",
      templateUrl: 'app/search/search.html',
      controller: 'SearchController',
      controllerAs: 'vm',
      authenticate : 'admin'
    })
    .state('actiloo.new-activities', {
      url: '/new-activities',
      templateUrl: 'app/newActivities/newActivities.html',
      controller: 'NewActivitiesController',
      controllerAs: 'vm',
      authenticate : 'admin'
    })
    .state('actiloo.edit-activity', {
      url: '/edit-activity/:id',
      templateUrl: 'app/newActivities/newActivities.html',
      controller: 'NewActivitiesController',
      controllerAs: 'vm',
      authenticate : 'admin'
    })
    .state('actiloo.my-activities', {
      url: '/activities',
      templateUrl: 'app/myActivities/myActivities.html',
      controller: 'MyActivitiesController',
      controllerAs: 'vm',
      authenticate : 'admin'
    })
    .state('actiloo.single-activity', {
      url: '/activity/:id',
      templateUrl: 'app/singleActivity/singleActivity.html',
      controller: 'SingleActivityController',
      controllerAs: 'vm',
      authenticate : 'admin'
    })
    .state('actiloo.my-reservations', {
      url: '/reservations',
      templateUrl: 'app/myReservations/myReservations.html',
      controller: 'MyReservationsController',
      controllerAs: 'vm',
      authenticate : 'admin'
    })
    .state('actiloo.single-reservation', {
      url: '/reservation/:id',
      templateUrl: 'app/singleReservation/singleReservation.html',
      controller: 'SingleReservationController',
      controllerAs: 'vm',
      authenticate : 'admin'
    })
    .state('actiloo.reviews', {
      url: '/reviews/:reservationId',
      templateUrl: 'app/reviews/reviews.html',
      controller: 'ReviewsController',
      controllerAs: 'vm',
      authenticate : 'admin'
    });


  $urlRouterProvider.otherwise('/');
}
