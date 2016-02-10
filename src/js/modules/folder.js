// ------------------------------ //
//             Folder             //
// ------------------------------ //

var $ = require('jquery');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var buttonize = require('buttonize');

function Folder(obj, config) {
    this.folder = obj;
    this.classes = window.PROJECT_NAME.Settings.Classes;

    this.config = $.extend({
        animation: 'linear',
        animationDuration: 400,
        openFirstFolder: true,
        ariaTextClass: 'aria-text',
        singleOpen: true,
        forceOpenClass: 'is-default-open',
        folderGroupClass: 'folder-group',
        folderTriggerClass: 'folder-trigger',
        folderContentClass: 'folder-content',
        ariaTextOpen: 'Cliquer pour ouvrir',
        ariaTextClose: 'Cliquer pour fermer',
        onFocus: $.noop,
        beforeOpen: $.noop,
        afterOpen: $.noop,
        beforeClose: $.noop,
        afterClose: $.noop,
        onBlur: $.noop
    }, config);

    // Get the folder trigger and transform the tags in a <button> tag
    this.folder.find('.' + this.config.folderTriggerClass).buttonize({
        a11y: this.config.a11y
    });
    this.folderTrigger = this.folder.find('.' + this.config.folderTriggerClass);

    // Get the folder content
    this.folderContent = this.folder.find('.' + this.config.folderContentClass);

    // Create and get the aria text
    this.folderTrigger.append('<span class="aria-text visuallyhidden"></span>');
    this.folderAria = this.folderTrigger.find('.' + this.config.ariaTextClass);

    this.init();
}

inherits(Folder, EventEmitter);

$.extend(Folder.prototype, {

    // Component initialization
    init: function() {

        // Bind events
        this.bindEvents();
    
        if (!this.folder.hasClass(this.config.forceOpenClass)) {
            this.folderContent.hide();
            this.changeAriaText(this.config.ariaTextOpen);
        } else {
            this.folder.addClass(this.classes.active);
        }

        if (this.config.openFirstFolder) {
            this.openFirstFolder();
        }
    },

    // Bind events with actions
    bindEvents: function() {
        // Click events
        this.folderTrigger.on('click', $.proxy(function() {
            // Folder is active
            if (this.folder.hasClass(this.classes.active)) {
                this.closeFolder();
            }
            // Folder is not active
            else {
                this.openFolder();
            }
        }, this));

        // Focus events
        this.folderTrigger.on('focus', $.proxy(function(e) {
            this.onTriggerFocus($(e.currentTarget));
        }, this));
        this.folderTrigger.on('blur', $.proxy(function(e) {
            this.onTriggerBlur($(e.currentTarget));
        }, this));
        
        this.folderTrigger.on('focus', this.config.onFocus);
        this.folderTrigger.on('blur', this.config.onBlur);
    },

    // Open the current folder
    openFolder: function() {
        this.config.beforeOpen();

        // With animation
        if (this.config.animation !== 'none') {
            this.folderContent.slideDown(this.config.animationDuration, $.proxy(function() {
                this.config.afterOpen();
                this.folder.addClass(this.classes.active);
                this.changeAriaText(this.config.ariaTextClose);
            }, this));
        }
        // Without animation
        else {
            this.folderContent.show();
            this.config.afterOpen();
            this.folder.addClass(this.classes.active);
            this.changeAriaText(this.config.ariaTextClose);
        }

        // Check if folder has parent and if parent has singleopen option set to true
        if (this.isGroup() && this.isSingleOpen()) {
            this.closeSiblings();
        }
    },

    // Close the current folder
    closeFolder: function() {
        this.config.beforeClose();

        // With animation
        if (this.config.animation !== 'none') {
            this.folderContent.slideUp(this.config.animationDuration, $.proxy(function() {
                this.config.afterClose();
                this.folder.removeClass(this.classes.active);
                this.changeAriaText(this.config.ariaTextOpen);
            }, this));
        }
        // Without animation
        else {
            this.folderContent.hide();
            this.config.afterClose();
            this.folder.removeClass(this.classes.active);
            this.changeAriaText(this.config.ariaTextOpen);
        }
    },

    // Open first folder
    openFirstFolder: function() {
        if (this.isGroup()) {
            var firstFolder = this.folder.parent('.' + this.config.folderGroupClass).find('.folder').first();
            firstFolder.find('.' + this.config.folderContentClass).show();
            firstFolder.addClass(this.classes.active);
        } else {
            this.folder.addClass(this.classes.active).find('.' + this.config.folderContentClass).show();
        }
    },

    // Close folder siblings
    closeSiblings: function() {
        var siblings = this.getSiblings().not(this.folder).find('.' + this.config.folderContentClass);

        // With animation
        if (this.config.animation !== 'none') {
            siblings.slideUp(this.config.animationDuration);
        }
        // Without animation
        else {
            siblings.hide();
        }

        this.getSiblings().removeClass(this.classes.active);
    },

    // Function to change the hidden text inside the folderTrigger
    changeAriaText: function(text) {
        this.folderAria.text(text);
    },

    // Change aria-live attribute on focus
    onTriggerFocus: function(trigger) {
        trigger.find('.' + this.config.ariaTextClass).attr('aria-live', 'polite');
    },

    // Change aria-live attribute on blur
    onTriggerBlur: function(trigger) {
        trigger.find('.' + this.config.ariaTextClass).removeAttr('aria-live');
    },

    // Check if folder is inside a group of folders
    isGroup: function() {
        return this.folder.parent().hasClass('folder-group');
    },

    // Check if group folder has singleopen option set to true
    isSingleOpen: function() {
        return (typeof this.folder.parent().data('singleopen') !== 'undefined' || this.config.singleOpen);
    },

    // If folder is inside a group, get all siblings
    getSiblings: function() {
        return this.folder.siblings() || false;
    }
});

module.exports = function(obj, config) {
    return obj.map(function(index, element) {
        return new Folder($(element), config);
    });
};
