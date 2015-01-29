var $ = require('jquery');

module.exports = (function() {

    var $body = $('body');

    $body.on('click', '.skip-content-link', function(e) {
        e.preventDefault();
        $('[role="main"]').eq(0).attr('tabindex', '-1').focus();
    });

}());
