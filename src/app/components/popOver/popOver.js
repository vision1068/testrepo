/**
 * Created by Fahad Saeed on 2/25/2016.
 */

export function PopOverDirective() {
  'ngInject';
  return  {
    restrict: 'A',
    link: PopOver,
    scope: {},
    controller: PopOverController,
    controllerAs: 'vm',
    bindToController: true
  };
}


class PopOverController {
  constructor ($timeout) {
    'ngInject';
    this.$timeout = $timeout;
  }
}

/****************** Pop over ********************/
function PopOver(scope, ele, attr, PopOverController){
  let _$ = angular.element;
  PopOverController.$timeout(function(){
    _$("[rel=" + "'"+ attr.rel +"'" +"]").popover({
      container: 'body',
      html: true,
      content: function () {
        return _$(_$(this).data('popover-content')).clone(true).removeClass('hide');
      }
    }).click(function(e) {
      e.preventDefault();
    });
  },1000)
}
