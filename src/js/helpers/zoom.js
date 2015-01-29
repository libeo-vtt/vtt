var $ = require('jquery');
var _ = require('lodash');
var onfontresize = require('onfontresize');

module.exports = (function() {

    var $body = $('body'),
        $document = $(document);

    $document.on('fontresize', $.proxy(function() {
        var bodyClasses = ($body.attr('class')) ? _.filter($body.attr('class').split(' '), function(x) {
                if (x.indexOf('is-font-') === -1) return x;
            }) : '',
            fontsize = parseInt($body.css('font-size').replace('px', ''), 10);

        if (bodyClasses) $body.attr('class', '').addClass(bodyClasses.join(' '));

        if (fontsize > 16) {
            $body.addClass('is-zoomed' + ' ' + 'is-font-' + fontsize);
        } else {
            $body.removeClass('is-zoomed');
        }
    }, this)).trigger('fontresize');

}());
