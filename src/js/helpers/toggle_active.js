var $ = require('jquery');

module.exports = (function() {

    var $body = $('body'),
        $document = $(document),
        classes = window.PROJECT_NAME.Settings.Classes;

    $document.on('click', '[data-toggle-active]', function() {
        $('.' + $(this).attr('data-toggle-active')).toggleClass(classes.active);
    });

}());
