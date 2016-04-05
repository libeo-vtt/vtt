// MODULENAME_UPPERCASE jQuery Plugin
// MODULE_DESCRIPTION

(function($) {
    var MODULENAME_UPPERCASE = function(element, options) {
        this.MODULENAME_LOWERCASE = $(element);

        this.config = $.extend({
            customGlobalClasses: {}
        }, options || {});

        this.classes = $.extend({
            active: 'is-active',
            open: 'is-open',
            hover: 'is-hover',
            clicked: 'is-clicked',
            extern: 'is-external',
            error: 'is-error'
        }, this.config.customGlobalClasses || {});

        this.init();
    };

    $.extend(MODULENAME_UPPERCASE.prototype, {

        // Component initialization
        init: function() {
            console.log('Module MODULENAME_LOWERCASE initiated');
        }

    });

    $.fn.MODULENAME_LOWERCASE = function(options) {
        return this.each(function() {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('MODULENAME_LOWERCASE')) return;

            // pass options to plugin constructor
            var MODULENAME_LOWERCASE = new MODULENAME_UPPERCASE(this, options);

            // Store plugin object in this element's data
            element.data('MODULENAME_LOWERCASE', MODULENAME_LOWERCASE);
        });
    };
})(jQuery);
