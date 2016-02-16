var $ = require('jquery');

module.exports = (function() {

    var $body = $('body'),
        $document = $(document);

    $document.on('click', '[data-toggle-active]', function(event) {
        var classes = $(this).attr('data-toggle-active');
        if (classes.indexOf(' ') > 0) {
            var classesArray = classes.split(' ');
            for (var i = 0; i < classesArray.length; i++) {
                $('.' + classesArray[i]).toggleClass(window.TFO.Settings.Classes.active);
            }
        } else {
            $('.' + classes).toggleClass(window.TFO.Settings.Classes.active);
        }
        event.preventDefault();
    });

}());
