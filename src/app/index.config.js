export function config ($logProvider, toastrConfig, $translateProvider, LightboxProvider) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);
  /**************** Translate  ******************/
  $translateProvider.useStaticFilesLoader({
    prefix: 'app/locale/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('en');

  /**************** Toastr Alert Configuration  ******************/
  toastrConfig.allowHtml = true;
  toastrConfig.maxOpened =  4;
  toastrConfig.timeOut = 4000;
  toastrConfig.positionClass = 'toast-top-center';
  toastrConfig.preventDuplicates = false;
  toastrConfig.progressBar = true;
  toastrConfig.closeButton = true;
  toastrConfig.closeHtml = '<button><i class="icon-cancel"></i></button>';
  toastrConfig.iconClasses= {
      error: 'error-toast',
      info: 'info-toast',
      success: 'success-toast',
      warning: 'warning-toast'
  };

  /**************** Light Box Configuration  ******************/
    LightboxProvider.fullScreenMode = true;
    LightboxProvider.templateUrl = 'app/components/lightBox/lightBox.html';
}
