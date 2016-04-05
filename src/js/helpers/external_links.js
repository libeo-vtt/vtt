(function() {

    $('a[href^="http:"]:not([href*="' + window.location.host + '"])').addClass('is-external');

}());
