function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

var kkeys = [], konami = "38,38,40,40,37,39,37,39";

var x = getCookie("orderlinks");

if (x){
    $(".orderlinks").show();
}

$(document).keydown(function(e) {
  kkeys.push( e.keyCode );
  if ( kkeys.toString().indexOf( konami ) >= 0 ){
    $(".orderlinks").show();
    document.cookie="orderlinks=1; expires=Fri, 18 Dec 2015 12:00:00 UTC; path=/";
  }
});