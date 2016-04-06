// MODULE_NAME_UPPERCASE jQuery Plugin
// MODULE_DESCRIPTION

(function($) {
    var MODULE_NAME_UPPERCASE = function(element, options) {
        this.MODULE_NAME_LOWERCASE = $(element);

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

    $.extend(MODULE_NAME_UPPERCASE.prototype, {

        // Component initialization
        init: function() {
            console.log('Module MODULE_NAME_LOWERCASE initiated');
        }

    });

    $.fn.MODULE_NAME_LOWERCASE = function(options) {
        return this.each(function() {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('MODULE_NAME_LOWERCASE')) return;

            // pass options to plugin constructor
            var MODULE_NAME_LOWERCASE = new MODULE_NAME_UPPERCASE(this, options);

            // Store plugin object in this element's data
            element.data('MODULE_NAME_LOWERCASE', MODULE_NAME_LOWERCASE);
        });
    };
})(jQuery);
