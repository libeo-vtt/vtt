(function() {

    var $body = $('body'),
        $document = $(document);

    $body.on('keydown', function(e) {
        var keyCode = (window.event) ? e.which : e.keyCode;
        if (!$body.attr('data-state')) {
            if (keyCode === 9 || keyCode === 13 || keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40) {
                $body.attr('data-state', 'keyboard');
                $document.trigger('keyboardnavigation');
            }
        }
    });

    $body.on('mousedown', function(e) {
        if ($body.attr('data-state')) {
            $body.removeAttr('data-state');
        }
    });

}());
