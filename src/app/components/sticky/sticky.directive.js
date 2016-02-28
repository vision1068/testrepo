/**
 * Created by Fahad Saeed on 2/25/2016.
 */

export function StickyDirective() {
  'ngInject';
  return  {
    restrict: 'A',
    link: StickyLink,
    scope: {}
  };
}

function StickyLink(scope, ele){
  ele.stick_in_parent({
    offset_top: 130
  })
}
