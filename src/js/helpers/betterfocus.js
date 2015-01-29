var $ = require('jquery');

module.exports = (function() {

    var $body = $('body'),
        $document = $(document);

    var classes = ['is-clicked', 'is-hover'],
        elements = ['a', 'button', 'input'].toString(),
        focusFunc = function(e) {
            var $this = $(this),
                eClass = (e.type === 'click') ? classes[0] : classes[1];

            $($this.get(0).tagName.toLowerCase() + '.' + eClass).removeClass(eClass);
            if (e.type !== 'mouseleave') $this.addClass(eClass);
        };

    $body.on('click mouseenter mouseleave', elements, focusFunc);

    $document.on('keyboardnavigation', function() {
        for (var i = 0; i < classes.length; i++)
            if ($('.' + classes[i]).length) $('.' + classes[i]).removeClass(classes[i]);
        $body.off('click mouseenter mouseleave', elements, focusFunc);
    });

}());
