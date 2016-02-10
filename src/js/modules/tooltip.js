// ------------------------------ //
//             Tooltip            //
// ------------------------------ //

var $ = require('jquery');
var buttonize = require('buttonize');

function Tooltip(obj, config) {

    this.tooltip = obj;
    this.classes = window.PROJECT_NAME.Settings.Classes;

    this.config = $.extend({
        tooltipTrigger: 'tooltip-trigger',
        tooltipContent: 'tooltip-content',
        a11y: true,
        a11yText: 'Cliquer pour ouvrir la boite d\'information supplémentaire'
    }, config, this.tooltip.data());

    this.tootltipContent = this.tooltip.find('*[data-js="' + this.config.tooltipContent + '"]');

    this.init();
}

$.extend(Tooltip.prototype, {

    // Component initialization
    init: function() {
        this.setToolTipTrigger();

        if ($('html').hasClass('desktop')) {
            this.bindMouseEvents();
            this.bindKeyDown();
            this.bindFocus();
        } else {
            this.bindTap();
            this.bindTapOut();
        }
    },
    setToolTipTrigger: function() {
        if ($('html').hasClass('lt-ie9') || $('body').hasClass('lt-ie9')) {
            this.tootltipTrigger = this.tooltip.find('*[data-js="' + this.tooltip.find('*[data-js="' + this.config.tooltipTrigger + '"]').buttonize({
                a11y: this.config.a11y,
                a11yText: this.config.a11yText
            }).attr('data-js') + '"]');
        } else {
            this.tootltipTrigger = this.tooltip.find('*[data-js="' + this.tooltip.find('*[data-js="' + this.config.tooltipTrigger + '"]').buttonize({
                a11y: this.config.a11y,
                a11yText: this.config.a11yText
            }).attr('data-js') + '"]').prop('type', 'button');
        }
    },
    bindMouseEvents: function() {
        this.tooltip.on({
            mouseenter: $.proxy(function() {
                this.showTip(false);
            }, this),
            mouseleave: $.proxy(function() {
                this.hideTip(false);
            }, this)
        });
    },
    bindKeyDown: function() {
        this.tooltip.on('click keydown', 'button', $.proxy(function(e) {

            var keyCode = (window.event) ? e.which : e.keyCode;

            if (keyCode === 13 || e.type === 'click') {
                this.tootltipContent.attr('tabindex', '-1');
                this.showTip(false);
                this.tootltipContent.focus();

                if ($(this.tooltip).closest('form').length > 0) {
                    e.preventDefault();
                }
            }
        }, this));
    },
    bindTap: function() {
        this.tooltip.on('click', 'button', $.proxy(function(e) {
            this.hideAll(true);
            this.manageClick();
            e.preventDefault();
        }, this));
    },
    bindTapOut: function() {
        $('html').on('click', $.proxy(function(e) {
            if (!$(e.target).hasClass(this.config.tooltipTrigger)) {
                if (!$(e.target).parent().hasClass(this.config.tooltipTrigger)) {
                    this.hideAll(true);
                }
            }
        }, this));
    },
    bindFocus: function() {
        this.tootltipContent.on('focusout', $.proxy(function() {
            this.hideTip();
        }, this));
    },
    manageClick: function() {
        if (this.tooltip.hasClass(this.classes.open)) {
            this.hideTip(true);
        } else {
            this.showTip(true);
        }
    },
    showTip: function(isMobile) {
        var withOffset = this.tooltip.offset().left <= 200 ? false : true;
        var tooltipHeight = this.tooltip.height() / 2;
        var contentHeight = this.tootltipContent.outerHeight();
        var tooltipWidth = this.tooltip.width();
        var contentWidth = this.tootltipContent.outerWidth();

        if (!isMobile) {
            this.tootltipContent.css({
                'top': '-' + (tooltipHeight + contentHeight) + 'px',
                'position': 'absolute',
                'bottom': 'initial'
            });
            this.tootltipContent.fadeIn(100);
            this.manageViewPortOffset(withOffset);
        } else {
            this.tootltipContent.css({
                'position': 'fixed',
                'bottom': '0',
                'left': '0',
                'top': 'initial',
                'width': '100vw'
            }).addClass('has-x').slideDown();
        }
        this.tooltip.addClass(this.classes.open);
    },
    hideTip: function(isMobile) {
        if (!isMobile) {
            this.tootltipContent.fadeOut(250);
        } else {
            this.tootltipContent.removeClass('has-x');
            this.tootltipContent.slideUp();
        }
        this.tooltip.removeClass(this.classes.open);
    },
    hideAll: function(isMobile) {
        var self = this;
        if (!isMobile) {
            $('.tooltip.' + self.classes.open).each(function() {
                var $this = $(this);
                $this.find('.' + self.config.tooltipContent).fadeOut(250);
                $this.removeClass(self.classes.open);
            });
        } else {
            $('.tooltip.' + self.classes.open).each(function() {
                var $this = $(this);
                $this.find('.' + self.config.tooltipContent).slideUp(400, function() {
                    $this.removeClass(self.classes.open);
                });
            });
        }
    },
    manageViewPortOffset: function(withOffset) {
        if (withOffset) {
            this.tootltipContent.css('right', '-32px');
        } else {
            this.tootltipContent.css('right', -(240 - this.tooltip.offset().left));
        }
    }
});

module.exports = function(obj, config) {
    return obj.map(function(index, element) {
        return new Tooltip($(element), config);
    });
};