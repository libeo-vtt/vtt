var $ = require('jquery');

function unquote(str) {
    // Fix issue in Internet Explorer with JSON.parse and quotes
    if (!$('html').hasClass('ie')) {
        return false;
    } else {
        return str.slice(1, str.length - 1);
    }
}

module.exports = (function() {

    $(window).on('resize', function() {
        window.breakpoints = JSON.parse(unquote(window.getComputedStyle(document.querySelector('body'), ':before').content));
    }).trigger('resize');

}());
