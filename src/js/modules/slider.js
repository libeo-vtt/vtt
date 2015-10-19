// ------------------------------ //
//             Slider             //
// ------------------------------ //

var $ = require('jquery');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var focusable = require('focusable');

function Slider(obj, config) {
    this.slider = obj;
    this.classes = window.PROJECT_NAME.Settings.Classes;

    this.config = $.extend({
        displayedSlides: 4,
        slidesMargin: 20,
        createNavigation: true,
        navigationType: 'both',
        sliderWrapperClass: 'slider-wrapper',
        sliderContainerClass: 'slider-container',
        slideClass: 'slide',
        sliderActiveContentClass: 'slider-activecontent',
        sliderTriggerClass: 'slide-trigger',
        sliderTriggerContentClass: 'slide-trigger-content',
        sliderNavigationClass: 'slider-navigation',
        navigationPrevClass: 'slider-navigation-prev',
        navigationNextClass: 'slider-navigation-next',
        navigationArrowClass: 'slider-navigation-arrows',
        navigationDotClass: 'slider-navigation-dots',
        navigationPrevText: 'Précédent',
        navigationNextText: 'Suivant',
        navigationDotText: 'Afficher la diapositive ',
        navigationDotActiveText: 'Diapositive présentement affichée',
        ariaTextClass: 'aria-text',
        ariaTextActiveClass: 'aria-text-active',
        ariaHiddenBoxClass: 'aria-hidden-box',
        displayDotsNumber: true,
        autoCenterActiveSlide: true,
        autoplay: false,
        autoplayDelay: 3000,
        autoplayButtonClass: 'slider-autoplay',
        autoplayButtonText: 'Mettre le carrousel en marche',
        autoplayButtonPauseText: 'Mettre le carrousel en pause',
        changeSlideLoop: true,
        animationSpeed: 300,
        beforeClone: $.noop,
        afterClone: $.noop,
        beforeChangeSlide: $.noop,
        afterChangeSlide: $.noop,
        beforeUpdateLayout: $.noop,
        afterUpdateLayout: $.noop,
        breakpoints: []
    }, config);

    // Get the sliders wrapper
    this.sliderWrapper = this.slider.find('.' + this.config.sliderWrapperClass);

    // Get the sliders container
    this.sliderContainer = this.slider.find('.' + this.config.sliderContainerClass);

    // Get the slides
    this.slides = this.slider.find('.' + this.config.slideClass);

    // Initialize activeSlideIndex
    this.activeSlideIndex = 0;

    // Get displayed slides number
    this.displayedSlides = this.config.displayedSlides;

    // Initialize current breakpoint
    this.currentBreakpoint = undefined;

    // Initialize mouse hover state
    this.mouseHover = false;

    // Initialize animated state
    this.animated = false;

    // Bind events
    this.bindEvents();

    // Navigation initialization
    if (this.config.createNavigation) {
        this.createNavigation(this.config.navigationType);
    }

    // Autoplay initialization
    if (this.config.autoplay) {
        this.autoplay();
    }

    this.init();
}

inherits(Slider, EventEmitter);

$.extend(Slider.prototype, {

    // Component initialization
    init: function() {
        // Layout initialization
        this.initLayout(this.config.displayedSlides);
        this.onResize();

        this.createAriabox();

        // Create active content wrapper
        if (this.isActiveContent()) {
            var content = this.slides.first().find('.' + this.config.sliderTriggerContentClass).clone();
            this.slider.prepend('<div class="' + this.config.sliderActiveContentClass + '"></div>');
            this.updateActiveSlideContent(content);
            // Auto center active slide
            if (this.config.autoCenterActiveSlide === true) {
                this.slider.find('.' + this.config.sliderActiveContentClass).css('text-align', 'center');
            }
        }
    },

    // Layout initialization
    initLayout: function() {
        var slideWidth = 100 / this.slides.length,
            slideWidthCalc = this.config.slidesMargin / this.slides.length * (this.slides.length - 1),
            slidesCSS = 'float: left;' +
            'position: relative;' +
            'width: ' + slideWidth + '%;' +
            'width: calc(' + slideWidth + '% - ' + slideWidthCalc + 'px);';

        // Callback
        this.config.beforeUpdateLayout();

        // Add necessary css for the slider
        this.sliderWrapper.css({
            'position': 'relative',
            'overflow': 'hidden'
        });

        this.sliderContainer.css({
            'position': 'relative',
            'left': '0',
            'width': this.slides.length / this.displayedSlides * 100 + '%'
        });

        this.slides.attr('style', slidesCSS).find('> a').css('display', 'block');

        // Add margin to all slides except the first one
        this.slides.slice(1).css({
            'margin-left': this.config.slidesMargin + 'px'
        });

        // Disable focus on hidden slides
        this.slides.slice(this.displayedSlides).find(':focusable').attr('tabindex', '-1');

        // Callback
        this.config.afterUpdateLayout();
    },

    // Bind events with actions
    bindEvents: function() {
        // Function called each time the window is resized
        $(window).on('resize', $.proxy(function() {
            this.onResize();
        }, this));

        this.slider.hover($.proxy(function() {
            this.mouseHover = true;
        }, this), $.proxy(function() {
            this.mouseHover = false;
        }, this));

        // Function called each time the sliderTrigger element is clicked
        if (this.isActiveContent()) {
            this.slider.find('.' + this.config.sliderTriggerClass).on('click', $.proxy(function(e) {
                var content = $(e.currentTarget).parents('.' + this.config.slideClass).find('.' + this.config.sliderTriggerContentClass).clone();
                this.updateActiveSlideContent(content);
                e.prevent();
            }, this));
        }

        // Detect keyboard navigation
        $(document).on('keyboardnavigation', $.proxy(function() {
            // Stop autoplay
            this.stopAutoplay();
        }, this));
    },

    // Create navigation
    createNavigation: function(type) {
        // Clear existing navigation
        this.slider.find('.' + this.config.sliderNavigationClass).remove();

        // Create navigation wrapper
        this.sliderWrapper.after('<div class="' + this.config.sliderNavigationClass + ' clearfix"></div>');

        // Get navigation wrapper obejct
        this.sliderNavigation = this.slider.find('.' + this.config.sliderNavigationClass);

        // Add navigation type class
        this.sliderNavigation.addClass('is-' + this.config.sliderNavigationClass + '-' + type);

        // Arrows navigation type
        if (type === 'arrows') {
            this.createArrowsNavigation();
        }
        // Dots navigation type
        else if (type === 'dots') {
            this.createDotsNavigation();
        }
        // Both navigation type
        else {
            this.createArrowsNavigation();
            this.createDotsNavigation();
        }
    },

    // Create arrows navigation
    createArrowsNavigation: function() {
        var previousButton = '<button class="' + this.config.navigationPrevClass + '"><span class="visuallyhidden ' + this.config.ariaTextClass + '">' + this.config.navigationPrevText + '</span></button>',
            nextButton = '<button class="' + this.config.navigationNextClass + '"><span class="visuallyhidden ' + this.config.ariaTextClass + '">' + this.config.navigationNextText + '</span></button>';

        // Create navigation wrapper
        this.sliderNavigation.append('<div class="' + this.config.navigationArrowClass + '-wrapper"></div>');

        // Append each arrows
        this.sliderNavigation.find('.' + this.config.navigationArrowClass + '-wrapper').append(previousButton, nextButton);

        // Get previous and next buttons
        this.navigationPrevious = this.sliderNavigation.find('.' + this.config.navigationPrevClass);
        this.navigationNext = this.sliderNavigation.find('.' + this.config.navigationNextClass);

        if (this.config.navigationType === 'both') {
            this.navigationPrevious.attr('aria-hidden', 'true');
            this.navigationNext.attr('aria-hidden', 'true');
        }

        this.bindEventsArrowsNavigation();
    },

    // Bind events for the arrows navigation
    bindEventsArrowsNavigation: function() {
        // Bind previous arrow event
        this.navigationPrevious.on('click', $.proxy(function(e) {
            this.navigationTypeTriggered = 'arrows';
            this.changeSlide(this.activeSlideIndex - 1);
            this.navigationNext.removeClass(this.classes.active);
            $(e.currentTarget).addClass(this.classes.active);

            // Update hidden aria box
            this.updateAriabox('La diapositive précédente est affichée.');

            // Stop autoplay
            this.stopAutoplay();
        }, this));

        // Bind next arrow event
        this.navigationNext.on('click', $.proxy(function(e) {
            this.navigationTypeTriggered = 'arrows';
            this.changeSlide(this.activeSlideIndex + 1);
            this.navigationPrevious.removeClass(this.classes.active);
            $(e.currentTarget).addClass(this.classes.active);

            // Update hidden aria box
            this.updateAriabox('La diapositive suivante est affichée.');

            // Stop autoplay
            this.stopAutoplay();
        }, this));
    },

    // Create dots navigation
    createDotsNavigation: function() {
        var dot = '<button class="' + this.config.navigationDotClass + '"><span class="visuallyhidden ' + this.config.ariaTextClass + '"></span></button>';

        // Create navigation wrapper
        this.sliderNavigation.append('<div class="' + this.config.navigationDotClass + '-wrapper"></div>');

        // Append each dots
        for (var i = 0; i < this.slides.length / this.displayedSlides; i++) {
            this.sliderNavigation.find('.' + this.config.navigationDotClass + '-wrapper').append(dot);
        }

        // Get dots elements
        this.navigationDots = this.sliderNavigation.find('.' + this.config.navigationDotClass);

        // Add aria text for each dot
        this.navigationDots.each($.proxy(function(index, el) {
            // Show dots number
            if (this.config.displayDotsNumber === true) {
                $(el).find('.' + this.config.ariaTextClass).text(this.config.navigationDotText).after(index + 1);
            }
            // Don't show dots number
            else {
                $(el).find('.' + this.config.ariaTextClass).text(this.config.navigationDotText + (parseInt(index) + 1));
            }
        }, this));

        // Initialize first dot button
        this.navigationDots.eq(0).addClass(this.classes.active).append('<span class="visuallyhidden ' + this.config.ariaTextActiveClass + '"> ' + this.config.navigationDotActiveText + '</span>');

        this.bindEventsDotsNavigation();
    },

    // Bind events for the dots navigation
    bindEventsDotsNavigation: function() {
        // Get dots elements
        this.navigationDots = this.sliderNavigation.find('.' + this.config.navigationDotClass);

        // Bind click events
        this.navigationDots.on('click', $.proxy(function(e) {
            this.navigationTypeTriggered = 'dots';
            var index = $(e.currentTarget).index() - $(e.currentTarget).parent().find('.slider-navigation-prev, .slider-navigation-next').length;
            this.changeSlide(index * this.displayedSlides);
            this.navigationDots.removeClass(this.classes.active);
            $(e.currentTarget).addClass(this.classes.active);

            // Stop autoplay
            this.stopAutoplay();
        }, this));
    },

    // Initialize autoplay
    autoplay: function() {
        this.createAutoplayButton();

        this.isAutoplay = true;
        this.toggleAutoplayText();

        this.autoplayInterval = setInterval($.proxy(function() {
            if (!this.mouseHover) {
                this.changeSlide(this.activeSlideIndex + 1);
            }
        }, this), this.config.autoplayDelay);

    },

    // Create autoplay button
    createAutoplayButton: function() {
        var button = '<button class="' + this.config.autoplayButtonClass + ' ' + this.classes.active + '"><span class="">' + this.config.autoplayButtonText + '</span></button>';

        // Create button
        if (this.sliderNavigation.find('.' + this.config.autoplayButtonClass).length < 1) {
            this.sliderNavigation.append(button);
            this.bindEventsAutoplayButton();
        }
    },

    bindEventsAutoplayButton: function() {
        // Get autoplay button
        this.autoplayButton = this.sliderNavigation.find('.' + this.config.autoplayButtonClass);

        // Bind click events
        this.autoplayButton.on('click', $.proxy(function() {
            if (this.isAutoplay) {
                this.stopAutoplay();
                this.autoplayButton.removeClass(this.classes.active);
            } else {
                this.mouseHover = false;
                this.autoplay();
                this.autoplayButton.addClass(this.classes.active);
            }
        }, this));
    },

    // Stop autoplay
    stopAutoplay: function() {
        this.isAutoplay = false;
        clearInterval(this.autoplayInterval);

        // Remove active class on autoplay button
        if (this.sliderNavigation.find('.' + this.config.autoplayButtonClass).length > 0) {
            this.sliderNavigation.find('.' + this.config.autoplayButtonClass).removeClass(this.classes.active);
            this.toggleAutoplayText();
        }
    },

    // Toggle aria text of autoplay button
    toggleAutoplayText: function() {
        if (this.sliderNavigation.find('.' + this.config.autoplayButtonClass).length > 0) {
            if (this.isAutoplay) {
                this.autoplayButton.find('span').text(this.config.autoplayButtonPauseText);
            } else {
                this.autoplayButton.find('span').text(this.config.autoplayButtonText);
            }
        }
    },

    // Create aria hidden box
    createAriabox: function() {
        if (this.config.navigationType === 'arrows') {
            this.slider.append('<div class="visuallyhidden ' + this.config.ariaHiddenBoxClass + '" aria-live="polite" aria-atomic="true" aria-hidden="true"></div>');
            this.ariaHiddenBox = this.slider.find('.' + this.config.ariaHiddenBoxClass);
        }
    },

    // Update aria hidden box
    updateAriabox: function(content) {
        if (this.config.navigationType === 'arrows') {
            this.ariaHiddenBox.html(content);
        }
    },

    // Change active slide
    changeSlide: function(index) {
        // Prevent slide outside the wrapper
        if (index < 0) {
            if (this.config.changeSlideLoop) {
                index = this.slides.length - this.displayedSlides;
            } else {
                index = 0;
            }
        } else if (index > this.slides.length - this.displayedSlides) {
            if (this.navigationTypeTriggered === 'dots') {
                index = this.slides.length - this.displayedSlides;
            } else {
                if (this.config.changeSlideLoop) {
                    index = 0;
                } else {
                    index = this.slides.length - this.displayedSlides;
                }
            }
        }

        // Only animated if there is no active animation
        if (!this.animated) {
            this.changeSlideAnimation(index);
        }
    },

    // Change active slide animation
    changeSlideAnimation: function(index) {
        // Update animation state
        this.animated = true;

        // Callback
        this.config.beforeChangeSlide();

        // Change slide animation
        this.sliderContainer.animate({
            left: 100 / this.displayedSlides * index * -1 + '%'
        }, this.config.animationSpeed, $.proxy(function() {
            // Update animation state
            this.animated = false;
            // Callback
            this.config.afterChangeSlide();
            // Update active slide index
            this.activeSlideIndex = index;
            // Update tabindex
            this.slides.find(':focusable').attr('tabindex', '-1');
            this.slides.slice(index, index + this.displayedSlides).find(':focusable').removeAttr('tabindex');
            if (this.config.navigationType === 'dots' || this.config.navigationType === 'both') {
                // Update dots buttons
                this.navigationDots.removeClass(this.classes.active).eq(index).addClass(this.classes.active);
                // Update hidden active text
                this.navigationDots.find('.' + this.config.ariaTextActiveClass).remove();
                this.navigationDots.eq(index).append('<span class="visuallyhidden ' + this.config.ariaTextActiveClass + '">' + this.config.navigationDotActiveText + '</span>');
            }
        }, this));
    },

    // Update active slide content
    updateActiveSlideContent: function(content) {
        this.config.beforeClone();
        this.slider.find('.' + this.config.sliderActiveContentClass).html(content);
        this.config.afterClone();
    },

    // Function triggered each time the window is resized
    onResize: function() {
        var breakpoints = this.config.breakpoints,
            currentBreakpoint;

        // Loop through each breakpoints
        for (var i = 0; i < breakpoints.length; i++) {
            if (Modernizr.mq('only all and (max-width: ' + breakpoints[i].maxwidth + 'px)')) {
                currentBreakpoint = i;
                break;
            } else {
                currentBreakpoint = undefined;
            }
        }

        // Update breakpoint
        this.updateBreakpoint(currentBreakpoint);
    },

    // Update layout when a breakpoint is triggered
    updateBreakpoint: function(breakpoint) {
        var breakpoints = this.config.breakpoints;

        // Check if breakpoint is not already active
        if (this.currentBreakpoint !== breakpoint) {
            // Check if existing breakpoint
            if (breakpoint !== undefined) {
                this.displayedSlides = breakpoints[breakpoint].displayedSlides;
                this.createNavigation(breakpoints[breakpoint].navigationType);
                this.initLayout();
            }
            // Fallback to  config
            else {
                this.displayedSlides = this.config.displayedSlides;
                this.createNavigation(this.config.navigationType);
                this.initLayout();
            }

            // Update current breakpoint
            this.currentBreakpoint = breakpoint;
        }
    },

    // Check if slider has active content attribute set to true
    isActiveContent: function() {
        return typeof this.slider.data('activecontent') !== 'undefined';
    }
});

module.exports = function(obj, config) {
    return obj.map(function(index, element) {
        return new Slider($(element), config);
    });
};
