// MODULE_NAME_UPPERCASE jQuery Plugin
// MODULE_DESCRIPTION

(function($) {
    var MODULE_NAME_UPPERCASE = function(element, options) {
        this.MODULE_NAME_LOWERCASE = $(element);

        // Default module configuration
        this.defaults = {
            labels: {
                label1: 'label1',
                label2: 'label2'
            },
            classes: {
                class1: 'class1',
                class2: 'class2',
                states: {
                    active: 'is-active'
                }
            }
        };

        // Merge default classes with window.project.classes
        this.classes = $.extend(true, this.defaults.classes, (window.project ? window.project.classes : {}));

        // Merge default labels with window.project.labels
        this.labels = $.extend(true, this.defaults.labels, (window.project ? window.project.labels : {}));

        // Merge default config with custom config
        this.config = $.extend(true, this.defaults, options || {});

        this.publicMethods = {
            methodName: $.proxy(function() {
                // console.log('methodName function called');
            }, this)
        };

        this.init();
    };

    $.extend(MODULE_NAME_UPPERCASE.prototype, {

        // Component initialization
        init: function() {
            // console.log('Module MODULE_NAME_LOWERCASE initiated');
        }

    });

    $.fn.MODULE_NAME_LOWERCASE = function(options) {
        this.each($.proxy(function(index, element) {
            var $element = $(element);

            // Return early if this $element already has a plugin instance
            if ($element.data('MODULE_NAME_LOWERCASE')) return;

            // Pass options to plugin constructor
            var MODULE_NAME_LOWERCASE = new MODULE_NAME_UPPERCASE(element, options);

            // Add every public methods to plugin
            for (var key in MODULE_NAME_LOWERCASE.publicMethods) {
                this[key] = MODULE_NAME_LOWERCASE.publicMethods[key];
            }

            // Store plugin object in this $element's data
            $element.data('MODULE_NAME_LOWERCASE', MODULE_NAME_LOWERCASE);
        }, this));

        return this;
    };
})(jQuery);
