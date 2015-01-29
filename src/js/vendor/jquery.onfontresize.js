'use strict';
/*!
 * Plugin name : onfontresize
 * Copyright (c) 2008 Petr Staníček (pixy@pixy.cz)
 * February 2009
 * @usage : $(document).on('fontresize',myHandler);
 * @optional stop the observer : $.onFontResize.unwatch();
 * @optional start again : $.onFontResize.watch();
 * @optional start with different timeout: $.onFontResize.watch(1000);
 */
(function($, window, document, undefined) {
    $.onFontResize = {
        delay: 250,
        timer: null,
        on: true,
        box: null,
        boxHeight: 0,
        init: function() {
            this.box = document.createElement('DIV');

            $(this.box).html('Détection du zoom').css({
                position: 'absolute',
                top: '-999px',
                left: '-9999px',
                display: 'inline',
                lineHeight: 1
            }).appendTo('body');

            this.boxHeight = $(this.box).height();
        },
        watch: function(delay) {
            if (!this.box) this.init();

            this.unwatch();

            if (delay) this.delay = delay;

            this.on = true;

            this.check();
        },
        unwatch: function() {
            this.on = false;
            if (this.timer) clearTimeout(this.timer);
        },
        check: function() {
            var that = $.onFontResize,
                h = $(that.box).height();

            if (h !== that.boxHeight) {
                that.boxHeight = h;
                $(document).triggerHandler('fontresize');
            }

            if (that.on) this.timer = setTimeout(that.check, that.delay);
        }
    };

    $(function() {
        $.onFontResize.watch();
    });

})(jQuery, window, document);
