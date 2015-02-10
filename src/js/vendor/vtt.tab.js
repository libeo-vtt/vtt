/**
 * Tab
 * app.setComponent('Tabs', 'Tab', $('.tab'));
 */
(function($, window, document, undefined) {

    var root = 'tab';

    function Tab(obj, config, app) {
        // Get reference to main Project settings
        this.app = app;

        // Overwrite the default configuration
        this.config = $.extend({}, {
            defaultOpenedTab    : 1,
            closeOnClick        : false,
            ariaTextClass       : 'aria-text',
            tabWrapperClass     : 'tab-wrapper',
            tabTriggerClass     : 'tab-trigger',
            tabContentClass     : 'tab-content',
            ariaText            : 'Cliquer pour afficher cet onglet',
            onFocus             : $.noop,
            beforeOpen          : $.noop,
            afterOpen           : $.noop,
            beforeClose         : $.noop,
            afterClose          : $.noop,
            onBlur              : $.noop
        }, config);

        // Set the "tab" or the main container
        this.tab = $(obj);

        // Get all app classes
        if (this.app) {
            this.classes = this.app.Classes;
        } else {
            this.classes = {
                active: 'is-active',
                open: 'is-open',
                hover: 'is-hover',
                clicked: 'is-clicked',
                extern: 'is-external',
                a11y: 'l-a11y',
                zoom: 'l-zoomed',
                font: 'l-font'
            };
        }

        // Get the tabs wrapper
        this.tabWrapper = this.tab.find( '.' + this.config.tabWrapperClass );

        // Get the tab trigger and transform the tags in a <button> tag
        this.tab.find( '.' + this.config.tabTriggerClass ).buttonize({ a11y: this.config.a11y });
        this.tabTrigger = this.tab.find( '.' + this.config.tabTriggerClass );

        // Get the tab content
        this.tabContent = this.tab.find( '.' + this.config.tabContentClass );

        // Create and get the aria text
        this.tabTrigger.append( '<span class="' + this.config.ariaTextClass + ' visuallyhidden">' + this.config.ariaText + '</span>' );

        // Bind events
        this.bindEvents();

        // Initialize tabTrigger positions
        this.adjustTabTrigger();

        this.init();
    }

    Tab.prototype = {

        // Component initialization
        init: function() {

            // Initialize wrapper layout
            this.tab.css({
                position: 'relative',
                paddingTop: $(this.calculateHighestTabTrigger()).eminize()
            });

            // Hide all tabs content
            this.tabContent.hide();

            this.changeTab( this.config.defaultOpenedTab - 1 );
        },

        // Bind events with actions
        bindEvents: function() {
            var self = this;

            // Click events
            self.tabTrigger.on('click', function(){
                if ( ! $(this).parents( '.' + self.config.tabWrapperClass ).hasClass( self.classes.active ) ) {
                    self.changeTab( $(this).parents( '.' + self.config.tabWrapperClass ).index() );
                }
                else if ( self.config.closeOnClick ) {
                    self.tabContent.hide();
                    $(this).parents( '.' + self.config.tabWrapperClass ).removeClass( self.classes.active );
                }


            });

            // Focus events
            self.tabTrigger.on( 'focus', self.config.onFocus );
            self.tabTrigger.on( 'blur', self.config.onBlur );
        },

        // Initialize tabTrigger positions
        adjustTabTrigger: function() {
            var self = this;

            self.tabTrigger.each(function(index, el) {
                $(this).css({
                    position: 'absolute',
                    top: '0',
                    left: self.calculateLeftOffset(index)
                });
            });
        },

        // Function to change active tab
        changeTab: function( index ) {
            this.tabContent.hide();
            this.tabWrapper.eq( index ).find( '.' + this.config.tabContentClass ).show();
            this.tabWrapper.removeClass( this.classes.active ).eq( index ).addClass( this.classes.active );
            this.tabTrigger.removeClass( this.classes.active ).eq( index ).addClass( this.classes.active );
        },

        // Function to calculate the height of the highest tab trigger
        calculateHighestTabTrigger: function() {
            var height = 0;

            this.tabTrigger.each(function(index, el) {
                if( $(el).outerHeight() > height ) {
                    height = $(el).outerHeight();
                }
            });

            return height;
        },

        // Function to calculate the height of the highest tab trigger
        calculateLeftOffset: function( index ) {
            var offset = 0;

            for (var i = 0; i < index; i++) {
                offset += this.tabTrigger.eq(i).outerWidth(true);
            }

            return $(offset).eminize();
        }
    };

    if (window.VTT) {
        VTT.extendComponents(Tab, root.charAt(0).toUpperCase() + root.slice(1));
    } else {
        $.fn[root] = function (config) {
            if (typeof config === 'string') {
                var args = Array.prototype.slice.call(arguments, 1);
                return this.each(function() {
                    var plugin = $.data(this, 'plugin_' + root);
                    plugin[config].apply(plugin, args);
                    return $(this);
                });
            } else if (!$.data(this, 'plugin_' + root)) {
                return this.each(function () {
                    if (!$.data(this, 'plugin_' + root)) { $.data(this, 'plugin_' + root, new Tab(this, config)); }
                });
            }
        };
    }

})(jQuery, window, document);
