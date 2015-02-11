// --------------------------- //
//             Tab             //
// --------------------------- //

var $ = require('jquery');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var eminize = require('eminize');
var buttonize = require('buttonize');

function Tab(obj, config) {
    this.tab = obj;
    this.classes = window.App.Settings.Classes;

    this.config = $.extend({
        defaultOpenedTab: 1,
        closeOnClick: false,
        ariaTextClass: 'aria-text',
        tabWrapperClass: 'tab-wrapper',
        tabTriggerClass: 'tab-trigger',
        tabContentClass: 'tab-content',
        ariaText: 'Cliquer pour afficher cet onglet',
        onFocus: $.noop,
        beforeOpen: $.noop,
        afterOpen: $.noop,
        beforeClose: $.noop,
        afterClose: $.noop,
        onBlur: $.noop
    }, config);

    // Get the tabs wrapper
    this.tabWrapper = this.tab.find('.' + this.config.tabWrapperClass);

    // Get the tab trigger and transform the tags in a <button> tag
    this.tab.find('.' + this.config.tabTriggerClass).buttonize({
        a11y: this.config.a11y
    });
    this.tabTrigger = this.tab.find('.' + this.config.tabTriggerClass);

    // Get the tab content
    this.tabContent = this.tab.find('.' + this.config.tabContentClass);

    // Create and get the aria text
    this.tabTrigger.append('<span class="' + this.config.ariaTextClass + ' visuallyhidden">' + this.config.ariaText + '</span>');

    // Bind events
    this.bindEvents();

    // Initialize tabTrigger positions
    this.adjustTabTrigger();

    this.init();
}

inherits(Tab, EventEmitter);

$.extend(Tab.prototype, {

    // Component initialization
    init: function() {
        // Initialize wrapper layout
        this.tab.css({
            position: 'relative',
            paddingTop: $(this.calculateHighestTabTrigger()).eminize()
        });

        // Hide all tabs content
        this.tabContent.hide();

        this.changeTab(this.config.defaultOpenedTab - 1);
    },

    // Bind events with actions
    bindEvents: function() {
        // Click events
        this.tabTrigger.on('click', $.proxy(function(e) {
            var element = e.currentTarget;
            if (!$(element).parents('.' + this.config.tabWrapperClass).hasClass(this.classes.active)) {
                this.changeTab($(element).parents('.' + this.config.tabWrapperClass).index());
            } else if (this.config.closeOnClick) {
                this.tabContent.hide();
                $(element).parents('.' + this.config.tabWrapperClass).removeClass(this.classes.active);
            }
        }, this));

        // Focus events
        this.tabTrigger.on('focus', this.config.onFocus);
        this.tabTrigger.on('blur', this.config.onBlur);
    },

    // Initialize tabTrigger positions
    adjustTabTrigger: function() {
        this.tabTrigger.each($.proxy(function(index, el) {
            $(el).css({
                position: 'absolute',
                top: '0',
                left: this.calculateLeftOffset(index)
            });
        }, this));
    },

    // Function to change active tab
    changeTab: function(index) {
        this.tabContent.hide();
        this.tabWrapper.eq(index).find('.' + this.config.tabContentClass).show();
        this.tabWrapper.removeClass(this.classes.active).eq(index).addClass(this.classes.active);
        this.tabTrigger.removeClass(this.classes.active).eq(index).addClass(this.classes.active);
    },

    // Function to calculate the height of the highest tab trigger
    calculateHighestTabTrigger: function() {
        var height = 0;

        this.tabTrigger.each(function(index, el) {
            if ($(el).outerHeight() > height) {
                height = $(el).outerHeight();
            }
        });

        return height;
    },

    // Function to calculate the height of the highest tab trigger
    calculateLeftOffset: function(index) {
        var offset = 0;

        for (var i = 0; i < index; i++) {
            offset += this.tabTrigger.eq(i).outerWidth(true);
        }

        return $(offset).eminize();
    }
});

module.exports = function(obj, config) {
    return obj.map(function(index, element) {
        return new Tab($(element), config);
    });
};
