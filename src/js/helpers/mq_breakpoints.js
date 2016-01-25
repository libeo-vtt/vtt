var $ = require('jquery');

module.exports = (function() {

    $(window).on('resize', function() {
        window.breakpoints = JSON.parse(JSON.parse(window.getComputedStyle(document.querySelector('body'), ':before').content));
    }).trigger('resize');

}());
