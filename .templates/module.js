// MODULE_NAME_UPPERCASE jQuery Plugin
// MODULE_DESCRIPTION

(function($) {
    var MODULE_NAME_UPPERCASE = function(element, options) {
        this.MODULE_NAME_LOWERCASE = $(element);

        // Default module configuration
        this.defaults = {
            classes: {
                class1: 'class1',
                class2: 'class2',
                states: {
                    active: 'is-active'
                }
            }
        };

        // Merge default classes with window.project.classes
        this.classes = $.extend(true, this.defaults.classes, window.project.classes || {});

        // Merge default config with custom config
        this.config = $.extend(true, this.defaults, options || {});

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
