var $ = require('jquery');

module.exports = (function() {

    $(window).on('resize', function() {
        window.breakpoint = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/"|'/g, '');
    }).trigger('resize');

}());
