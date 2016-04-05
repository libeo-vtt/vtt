(function() {

    var $document = $(document),
        $body = $('body');

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
                $document.triggerHandler('fontresize');
            }

            if (that.on) this.timer = setTimeout(that.check, that.delay);
        }
    };

    $.onFontResize.watch();

    $document.on('fontresize', $.proxy(function() {
        var bodyClasses = ($body.attr('class')) ? _.filter($body.attr('class').split(' '), function(x) {
                if (x.indexOf('is-font-') === -1) return x;
            }) : '',
            fontsize = parseInt($body.css('font-size').replace('px', ''), 10);

        if (bodyClasses) $body.attr('class', '').addClass(bodyClasses.join(' '));

        if (fontsize > 16) {
            $body.addClass(window.classes.zoom + ' ' + 'is-font-' + fontsize);
        } else {
            $body.removeClass(window.classes.zoom);
        }
    }, this)).trigger('fontresize');

}());
