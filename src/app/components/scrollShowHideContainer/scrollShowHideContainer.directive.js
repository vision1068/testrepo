/**
 * Created by Fahad Saeed on 2/23/2016.
 */

export function ScrollShowHideDirective() {
  'ngInject';

  return  {
    restrict: 'A',
    link: ScrollLink,
    scope: {},
    controller: ScrollController,
    controllerAs: 'vm',
    bindToController: true
  };
}

class ScrollController {
  constructor ($window) {
    'ngInject';
    this.$window = $window;
  }
}

function ScrollLink(scope, ele, attr, ScrollController){
  let scroll, perviousScroll,vm = this;
  angular.element(ScrollController.$window).bind("scroll", function() {
    scroll = this.pageYOffset;
    if(perviousScroll){
      if (scroll > perviousScroll){
        ele.removeClass("slideInDown").addClass("slideOutUp");
      } else {
        ele.removeClass("slideOutUp").addClass("slideInDown");
      }
    }
    perviousScroll = scroll;
  });
}
