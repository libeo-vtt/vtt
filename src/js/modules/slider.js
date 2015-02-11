// ------------------------------ //
//             Slider             //
// ------------------------------ //

var $ = require('jquery');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var focusable = require('focusable');

function Slider(obj, config) {
    this.slider = obj;
    this.classes = window.App.Settings.Classes;

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
        changeSlideLoop: false,
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
        var self = this;

        // Function called each time the window is resized
        $(window).on('resize', function() {
            self.onResize();
        });

        this.slider.hover(function() {
            self.mouseHover = true;
        }, function() {
            self.mouseHover = false;
        });

        // Function called each time the sliderTrigger element is clicked
        if (this.isActiveContent()) {
            this.slider.find('.' + this.config.sliderTriggerClass).on('click', function(e) {
                var content = $(this).parents('.' + self.config.slideClass).find('.' + self.config.sliderTriggerContentClass).clone();
                self.updateActiveSlideContent(content);
                e.prevent();
            });
        }

        // Detect keyboard navigation
        $(document).on('keyboardnavigation', function() {
            // Stop autoplay
            self.stopAutoplay();
        });
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
        this.sliderNavigation.addClass(this.config.sliderNavigationClass + '-' + type);

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
        var self = this;

        // Bind previous arrow event
        this.navigationPrevious.on('click', function() {
            self.changeSlide(self.activeSlideIndex - 1);
            self.navigationNext.removeClass(self.classes.active);
            $(this).addClass(self.classes.active);

            // Update hidden aria box
            self.updateAriabox('La diapositive précédente est affichée.');

            // Stop autoplay
            self.stopAutoplay();
        });

        // Bind next arrow event
        this.navigationNext.on('click', function() {
            self.changeSlide(self.activeSlideIndex + 1);
            self.navigationPrevious.removeClass(self.classes.active);
            $(this).addClass(self.classes.active);

            // Update hidden aria box
            self.updateAriabox('La diapositive suivante est affichée.');

            // Stop autoplay
            self.stopAutoplay();
        });
    },

    // Create dots navigation
    createDotsNavigation: function() {
        var self = this,
            dot = '<button class="' + this.config.navigationDotClass + '"><span class="visuallyhidden ' + this.config.ariaTextClass + '"></span></button>';

        // Create navigation wrapper
        this.sliderNavigation.append('<div class="' + this.config.navigationDotClass + '-wrapper"></div>');

        // Append each dots
        for (var i = 0; i < this.slides.length / this.displayedSlides; i++) {
            this.sliderNavigation.find('.' + this.config.navigationDotClass + '-wrapper').append(dot);
        }

        // Get dots elements
        this.navigationDots = this.sliderNavigation.find('.' + this.config.navigationDotClass);

        // Add aria text for each dot
        this.navigationDots.each(function(index, el) {
            // Show dots number
            if (self.config.displayDotsNumber === true) {
                $(el).find('.' + self.config.ariaTextClass).text(self.config.navigationDotText).after(index + 1);
            }
            // Don't show dots number
            else {
                $(el).find('.' + self.config.ariaTextClass).text(self.config.navigationDotText + (parseInt(index) + 1));
            }
        });

        // Initialize first dot button
        this.navigationDots.eq(0).addClass(self.classes.active).append('<span class="visuallyhidden ' + self.config.ariaTextActiveClass + '"> ' + self.config.navigationDotActiveText + '</span>');

        this.bindEventsDotsNavigation();
    },

    // Bind events for the dots navigation
    bindEventsDotsNavigation: function() {
        var self = this;

        // Get dots elements
        this.navigationDots = this.sliderNavigation.find('.' + this.config.navigationDotClass);

        // Bind click events
        this.navigationDots.on('click', function() {
            var index = $(this).index() - $(this).parent().find('.slider-navigation-prev, .slider-navigation-next').length;
            self.changeSlide(index * self.displayedSlides);
            self.navigationDots.removeClass(self.classes.active);
            $(this).addClass(self.classes.active);

            // Stop autoplay
            self.stopAutoplay();
        });
    },

    // Initialize autoplay
    autoplay: function() {
        var self = this;

        this.createAutoplayButton();

        this.isAutoplay = true;
        this.toggleAutoplayText();

        this.autoplayInterval = setInterval(function() {
            if (!self.mouseHover) {
                self.changeSlide(self.activeSlideIndex + 1);
            }
        }, this.config.autoplayDelay);

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
        var self = this;

        // Get autoplay button
        this.autoplayButton = this.sliderNavigation.find('.' + this.config.autoplayButtonClass);

        // Bind click events
        this.autoplayButton.on('click', function() {
            if (self.isAutoplay) {
                self.stopAutoplay();
                self.autoplayButton.removeClass(self.classes.active);
            } else {
                self.mouseHover = false;
                self.autoplay();
                self.autoplayButton.addClass(self.classes.active);
            }
        });
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
            if (this.config.changeSlideLoop) {
                index = 0;
            } else {
                index = this.slides.length - this.displayedSlides;
            }
        }

        // Only animated if there is no active animation
        if (!this.animated) {
            this.changeSlideAnimation(index);
        }
    },

    // Change active slide animation
    changeSlideAnimation: function(index) {
        var self = this;

        // Update animation state
        this.animated = true;

        // Callback
        this.config.beforeChangeSlide();

        // Change slide animation
        this.sliderContainer.animate({
            left: 100 / self.displayedSlides * index * -1 + '%'
        }, self.config.animationSpeed, function() {
            // Update animation state
            self.animated = false;
            // Callback
            self.config.afterChangeSlide();
            // Update active slide index
            self.activeSlideIndex = index;
            // Update tabindex
            self.slides.find(':focusable').attr('tabindex', '-1');
            self.slides.slice(index, index + self.displayedSlides).find(':focusable').removeAttr('tabindex');
            if (self.config.navigationType === 'dots' || self.config.navigationType === 'both') {
                // Update dots buttons
                self.navigationDots.removeClass(self.classes.active).eq(index).addClass(self.classes.active);
                // Update hidden active text
                self.navigationDots.find('.' + self.config.ariaTextActiveClass).remove();
                self.navigationDots.eq(index).append('<span class="visuallyhidden ' + self.config.ariaTextActiveClass + '">' + self.config.navigationDotActiveText + '</span>');
            }
        });
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
