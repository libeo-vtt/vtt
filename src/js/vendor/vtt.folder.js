/**
 * Folder
 * app.setComponent('Folders', 'Folder', $('.folder'));
 */
(function($, window, document, undefined) {

    var root = 'folder';

    function Folder(obj, config, app) {
        // Get reference to main Project settings
        this.app = app;

        // Overwrite the default configuration
        this.config = $.extend({}, {
            animation           : 'linear',
            animationDuration   : 400,
            openFirstFolder     : true,
            ariaTextClass       : 'aria-text',
            forceOpenClass      : 'is-default-open',
            folderGroupClass    : 'folder-group',
            folderTriggerClass  : 'folder-trigger',
            folderContentClass  : 'folder-content',
            ariaTextOpen        : 'Cliquer pour ouvrir',
            ariaTextClose       : 'Cliquer pour fermer',
            onFocus             : $.noop,
            beforeOpen          : $.noop,
            afterOpen           : $.noop,
            beforeClose         : $.noop,
            afterClose          : $.noop,
            onBlur              : $.noop
        }, config);

        // Set the "folder" or the main container
        this.folder = $(obj);

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

        // Get the folder trigger and transform the tags in a <button> tag
        this.folder.find( '.' + this.config.folderTriggerClass ).buttonize({ a11y: this.config.a11y });
        this.folderTrigger = this.folder.find( '.' + this.config.folderTriggerClass );

        // Get the folder content
        this.folderContent = this.folder.find( '.' + this.config.folderContentClass );

        // Create and get the aria text
        this.folderTrigger.append( '<span class="aria-text visuallyhidden"></span>' );
        this.folderAria = this.folderTrigger.find( '.' + this.config.ariaTextClass );

        // Bind events
        this.bindEvents();

        this.init();
    }

    Folder.prototype = {

        // Component initialization
        init: function() {
            var self = this;

            if ( ! self.folder.hasClass( self.config.forceOpenClass ) ){
                self.folderContent.hide();
                self.changeAriaText(self.config.ariaTextOpen);
            }
            else {
                self.folder.addClass( self.classes.active );
            }

            if ( self.config.openFirstFolder ){ self.openFirstFolder(); }
        },

        // Bind events with actions
        bindEvents: function() {
            var self = this;

            // Click events
            self.folderTrigger.on('click', function(){
                // Folder is active
                if ( self.folder.hasClass( self.classes.active ) ) {
                    self.closeFolder();
                }
                // Folder is not active
                else {
                    self.openFolder();
                }
            });

            // Focus events
            self.folderTrigger.on( 'focus', self.config.onFocus );
            self.folderTrigger.on( 'blur', self.config.onBlur );
        },

        // Open the current folder
        openFolder: function() {
            var self = this;

            self.config.beforeOpen();

            // With animation
            if ( self.config.animation !== 'none' ) {
                self.folderContent.slideDown( self.config.animationDuration, function(){
                    self.config.afterOpen();
                    self.folder.addClass( self.classes.active );
                    self.changeAriaText(self.config.ariaTextClose);
                });
            }
            // Without animation
            else {
                self.folderContent.show();
                self.config.afterOpen();
                self.folder.addClass( self.classes.active );
                self.changeAriaText(self.config.ariaTextClose);
            }

            // Check if folder has parent and if parent has singleopen option set to true
            if ( self.isGroup() && self.isSingleOpen() ) { self.closeSiblings(); }
        },

        // Close the current folder
        closeFolder: function() {
            var self = this;

            self.config.beforeClose();

            // With animation
            if ( self.config.animation !== 'none' ){
                self.folderContent.slideUp( self.config.animationDuration, function(){
                    self.config.afterClose();
                    self.folder.removeClass( self.classes.active );
                    self.changeAriaText(self.config.ariaTextOpen);
                });
            }
            // Without animation
            else {
                self.folderContent.hide();
                self.config.afterClose();
                self.folder.removeClass( self.classes.active );
                self.changeAriaText(self.config.ariaTextOpen);
            }
        },

        // Open first folder
        openFirstFolder: function() {
            var self = this;

            if ( self.isGroup() ){
                var firstFolder = self.folder.parent( '.' + self.config.folderGroupClass ).find('.folder').first();
                firstFolder.find('.' + self.config.folderContentClass).show();
                firstFolder.addClass( self.classes.active );
            }
        },

        // Close folder siblings
        closeSiblings: function() {
            var self = this,
                siblings = self.getSiblings().not(self.folder).find( '.' + self.config.folderContentClass );

            // With animation
            if ( self.config.animation !== 'none' ) {
                siblings.slideUp( self.config.animationDuration);
            }
            // Without animation
            else {
                siblings.hide();
            }

            self.getSiblings().removeClass( self.classes.active );
        },

        // Function to change the hidden text inside the folderTrigger
        changeAriaText: function( text ) {
            this.folderAria.text( text );
        },

        // Check if folder is inside a group of folders
        isGroup: function() {
            return this.folder.parent().hasClass('folder-group');
        },

        // Check if group folder has singleopen option set to true
        isSingleOpen: function() {
            return typeof this.folder.parent().data('singleopen') !== 'undefined';
        },

        // If folder is inside a group, get all siblings
        getSiblings: function() {
            return this.folder.siblings() || false;
        }
    };

    if (window.VTT) {
        VTT.extendComponents(Folder, root.charAt(0).toUpperCase() + root.slice(1));
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
                    if (!$.data(this, 'plugin_' + root)) { $.data(this, 'plugin_' + root, new Folder(this, config)); }
                });
            }
        };
    }

})(jQuery, window, document);
