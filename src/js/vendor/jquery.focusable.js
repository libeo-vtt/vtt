/*
* jQuery Focusable Selector
* @author Danny Turcotte <turcottedanny@gmail.com>
*
* Usage: $('#my-container').find(':focusable');
*/
$.extend($.expr[':'], {
    focusable: function(el, index, selector) {
        return $(el).is('a, button, :input, [tabindex]');
    }
});
