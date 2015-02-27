'use strict';
(function($, window, document, undefined) {

    var defaultConfig = {
        scope: 'body'
    };

    var Eminize = function(pxValue, config) {
        this.config = $.extend({}, defaultConfig, config);
        this.pxValue = pxValue;
    };

    Eminize.prototype.init = function() {
        var that = parseInt(this.pxValue[0], 10),
            scopeTest = $('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&nbsp;</div>').appendTo(this.config.scope),
            scopeVal = scopeTest.height();

        scopeTest.remove();
        return (that / scopeVal).toFixed(8) + 'em';
    };

    $.fn.eminize = function(config) {
        var em = new Eminize(this, config);
        return em.init();
    };

})(jQuery, window, document);
