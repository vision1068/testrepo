/**
 * Created by Fahad Saeed on 1/26/2016.
 */

/******************** Currencies Filter ********************/
export function CurrenciesFilter(){
  return function(input){
    let currency = input ;
    switch(input) {
      case 'USD':
        currency = '$';
        break;
      case 'EUR':
        currency = '€';
        break;
      case 'GBP':
        currency = '£';
        break;
    }
    return currency;
  }
}


/******************** Date Filter ********************/
export function DateFilter(){
  return function(input){
    let day, month, date = new Date(input) ;
    day = ( (''+date.getDate()).length == 1 ) ? '0'+ date.getDate() : date.getDate();
    month = ( (''+(date.getMonth()+1)).length == 1 ) ? '0'+ (date.getMonth()+1) : date.getMonth()+1;
    return day + '/'+  month + '/' + date.getFullYear();
  }
}


/******************** Date Filter With Time ********************/
export function DateWithTime(){
  return function(input){
    let day, month, hr, min,date = new Date(input) ;
    day = ( (''+date.getDate()).length == 1 ) ? '0'+ date.getDate() : date.getDate();
    month = ( (''+(date.getMonth()+1)).length == 1 ) ? '0'+ (date.getMonth()+1) : date.getMonth()+1;
    hr = ( (''+date.getHours()).length == 1 ) ? '0'+ date.getHours() : date.getHours();
    min = ( (''+date.getMinutes()).length == 1 ) ? '0'+ date.getMinutes() : date.getMinutes();
    return day + '/'+  month + '/' + date.getFullYear() + ' '+ hr + ':' +  min;
  }
}


/******************** Remove Underscore In String ********************/
export function RemoveUnderscore(){
  return function(input){
    return input.replace(/_/g, ' ');
  }
}


/******************** Remove Underscore In String ********************/
export function priceUnit(){
  return function(input){
    return input == 'PER_PERSON'? 'person' : 'reservation';
  }
}

/******************** Remove Underscore In String ********************/
//export function inlinePlaces(){
//  return function(input){
//    let place;
//    for(let i = 0 ; i < input.length; i++){
//      place = place + input[i].name;
//      if(input.length > 1 && i != input.length-1){
//        place = place + ', ';
//      }
//    }
//    return place;
//  }
//}


/******************** language Filter ********************/
export function languageFilter(){
  return function(input){
    let language = input ;
    switch(input) {
      case 'en':
        language = 'English';
        break;
      case 'fr':
        language = 'French';
        break;
      case 'es':
        language = 'Spanish';
        break;
      case 'ur':
        language = 'Urdu';
        break;
    }
    return language;
  }
}


/******************** Status Filter ********************/
export function StatusFilter(){
  return function(input){
    let status = input ;
    switch(input) {
      case 'REQUEST_CANCELED':
        status = 'Canceled';
        break;
      case 'REQUEST_COMPLETED':
        status = 'Completed';
        break;
      case 'REQUEST_CLIENT_MODIFIED':
        status = 'Waiting for confirmation';
        break;
      case 'NEW_REQUEST':
        status = 'Waiting for confirmation';
        break;
      case 'REQUEST_CONFIRMED':
        status = 'Confirmed';
        break;
      case 'REQUEST_OK':
        status = 'Confirmed';
        break;
      case 'REQUEST_OWNER_MODIFIED':
        status = 'Pre approved';
        break;
      case 'REQUEST_OWNER_OK':
        status = 'Pre approved';
        break;
       case 'REQUEST_REJECTED':
        status = 'Rejected';
        break;
    }
    return status.replace(/_/g, ' ');
  }
}
