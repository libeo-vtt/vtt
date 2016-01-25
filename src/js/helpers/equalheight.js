var $ = require('jquery');
var _ = require('lodash');
var waitForImages = require('waitforimages');
var breakpoints = require('./mq_breakpoints');

module.exports = (function() {

    var identifiers = [];

    $(window).on('resize', _.debounce(function() {
        var currentBPidentifiers = [];
        var currentBreakpoint = window.breakpoints.current;

        $('[data-equalheight]').each(function() {
            var ids = $(this).data('equalheight').split(' ');
            _.forEach(ids, function(id) {
                var hasBreakpoint = false;
                // Check if current breakpoint contains a breakpoint
                _.forEach(window.breakpoints.all, function(breakpoint, key) {
                    if(id.endsWith(key)) hasBreakpoint = true;
                });
                // Check if breakpoint is current
                if (hasBreakpoint && id.endsWith(currentBreakpoint) && !_.contains(currentBPidentifiers, id)) {
                    currentBPidentifiers.push(id);
                }
                // ID has no breakpoint
                if (!hasBreakpoint && !_.contains(identifiers, id)) {
                    identifiers.push(id);
                }
            });
        });

        _.forEach(identifiers, function(id) {
            var elements = $('[data-equalheight~=' + id + ']');
            setEqualheight(elements);
        });

        _.forEach(currentBPidentifiers, function(id) {
            var elements = $('[data-equalheight~=' + id + ']');
            setEqualheight(elements);
        });
    }, 100)).trigger('resize');

}());

function setEqualheight(elements) {
    var height = 0;
    $(elements).css('height', 'auto');
    elements.waitForImages(function() {
        elements.each(function() {
            var $this = $(this),
                currentHeight = 0;

            $this.css('height', 'auto');
            currentHeight = $this.outerHeight();
            height = (currentHeight > height ? currentHeight : height);
        });
        elements.outerHeight(height);
    });
}
