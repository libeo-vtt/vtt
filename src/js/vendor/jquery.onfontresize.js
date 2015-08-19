'use strict';
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
            }).attr('aria-hidden', 'true').appendTo('body');

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
