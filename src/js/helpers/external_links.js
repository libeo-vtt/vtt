var $ = require('jquery');

module.exports = (function() {

    $('a[href^="http:"]:not([href*="' + window.location.host + '"])').addClass('is-external');

}());
