/**
 * Lightbox
 * app.setComponent('Lightboxs', 'Lightbox', $('.lightbox'));
 *
 *      -----------------------------------------------------------------------
 *
 *      # TODO
 *
 *      1 - Optimisation
 *
 *      4 - Add links to lightbox captions
 *
 *      -----------------------------------------------------------------------
 *
 *      # WISHLIST
 *
 *      1 - Better Google Maps support (API?)
 *
 *      -----------------------------------------------------------------------
 *
 */
(function($, window, document, undefined) {

    var root = 'lightbox',
        $window = $(window),
        $body = $('body');

    function Lightbox(obj, config, app) {
        // Get reference to main Project settings
        this.app = app;

        // Overwrite the default configuration
        this.config = $.extend({}, {
            relativeNavigation: true,
            showCaption: true,
            showPositionCaption: true,
            wrapperClass: 'lightbox-wrapper',
            overlayClass: 'lightbox-overlay',
            sliderWrapperClass: 'lightbox-slider-wrapper',
            sliderContainerClass: 'lightbox-slider-container',
            sliderElementClass: 'lightbox-slider-element',
            containerClass: 'lightbox-container',
            contentClass: 'lightbox-content',
            navigationClass: 'lightbox-navigation',
            closeClass: 'lightbox-navigation-close',
            closeText: 'Fermer le lightbox',
            arrowPrevClass: 'lightbox-navigation-prev',
            arrowPrevText: 'Afficher l\'élément précédent',
            arrowNextClass: 'lightbox-navigation-next',
            arrowNextText: 'Afficher l\'élément suivant',
            beforeLoadClass: 'is-loading',
            afterLoadClass: 'is-loaded',
            beforeClose: $.noop,
            afterClose: $.noop,
            beforeLoad: $.noop,
            afterLoad: $.noop
        }, config);

        // Set the "lightbox" or the main container
        this.trigger = $(obj);

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

        // Initialize index position
        this.currentIndex = 0;

        // Initialize animation state
        window.isLightboxAnimated = false;

        // Call the bindEvents function
        this.bindEvents();
    }

    Lightbox.prototype = {

        // Bind functions to events
        bindEvents: function() {
            var self = this;

            this.trigger.on('click', function(e) {
                // Prevent default click action
                e.preventDefault();

                // Save referer to focus when lightbox close
                self.referer = $(this);

                // Delete existing lightbox
                self.close();

                // Create new lightbox
                self.create();
            });
        },

        // Bind close event
        bindCloseEvent: function() {
            var self = this;

            // Close lightbox when close button or overlay is clicked
            this.lightboxNavigation.find('.' + this.config.closeClass).add('.' + this.config.overlayClass).on('click', function() {
                self.config.beforeClose();
                self.close();
                self.config.afterClose();
            });

            this.lightbox.add(this.lightbox.find('a, button, :input, [tabindex]')).on('blur', function() {
                //self.onBlur($(this));
            });
        },

        // Function called after blur event
        onBlur: function(element) {
            var self = this;
            window.setTimeout(function() {
                var activeElement = document.activeElement;
                if ($(activeElement).parents('.' + self.config.wrapperClass).length === 0) {
                    self.close();
                }
            }, 1);
        },

        // Bind resize event
        bindResizeEvent: function() {
            var self = this;

            // Bind event when resize event is finished
            $window.resize(function() {
                // Function source: http://stackoverflow.com/a/12692647/2141535
                if (this.resizeTo) clearTimeout(this.resizeTo);
                this.resizeTo = setTimeout(function() {
                    $(this).trigger('resizeEnd');
                }, 100);
            });

            // Only trigger resize event when resize event is ended
            $window.bind('resizeEnd', function() {
                self.onResize();
            });
        },

        // Function called after resize event
        onResize: function() {
            this.resizeLayout();
            //this.resetCaptionLayout(this.lightbox.find('img, iframe'));
            this.updateCaptionLayout(this.lightbox.find('img, iframe'));
        },

        // Bind gallery navigation events
        bindGalleryNavigation: function() {
            this.bindPrevEvent();
            this.bindNextEvent();
            this.bindKeyboardEvent();
            this.bindSwipeEvent();
        },

        // Bind previous button event
        bindPrevEvent: function() {
            var self = this;

            // Previous button click event
            this.lightboxPrev.on('click', function() {
                if (!window.isLightboxAnimated) {
                    self.changePrevElement();
                }
            });
        },

        // Bind next button event
        bindNextEvent: function() {
            var self = this;

            // Next button click event
            this.lightboxNext.on('click', function() {
                if (!window.isLightboxAnimated) {
                    self.changeNextElement();
                }
            });
        },

        // Bind keyboard events
        bindKeyboardEvent: function() {
            var self = this;

            $(document).keydown(function(e) {
                // Left arrow event
                if (e.which === 37 && !window.isLightboxAnimated) {
                    self.changePrevElement();
                }
                // Left arrow event
                else if (e.which === 39 && !window.isLightboxAnimated) {
                    self.changeNextElement();
                }
            });
        },

        // Bind swipe events
        bindSwipeEvent: function() {
            var self = this;

            // this.lightbox.swipe({
            //     swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
            //         // Left swipe
            //         if (direction === 'left' && !window.isLightboxAnimated) {
            //             self.changeNextElement();
            //         }
            //         // Right swipe
            //         else if (direction === 'right' && !window.isLightboxAnimated) {
            //             self.changePrevElement();
            //         }
            //     }
            // });
        },

        // Create lightbox function
        create: function() {
            // Lightbox wrapper
            var lightboxMarkup = $('<div class="' + this.config.wrapperClass + ' type-' + this.trigger.data('type') + '"></div>');

            // Append lightbox to body
            $body.append(lightboxMarkup).append('<button class="lightbox-guard visuallyhidden"></button>');
            this.lightbox = $body.find('.' + this.config.wrapperClass);

            if (this.isGallery()) {
                this.lightbox.addClass('is-gallery');
                this.createGalleryContainer();
            } else {
                this.lightbox.addClass('is-single');
                this.createSingleContainer();
            }

            this.createNavigation();
            this.createOverlay();
            this.bindCloseEvent();
            this.bindResizeEvent();
            this.setCurrentIndex();
            this.loadContent();
            this.resizeLayout();

            if (this.isGallery()) {
                this.loadPrevElement();
                this.loadNextElement();
            }

            this.focusLightbox();
        },

        // Create background overlay
        createOverlay: function() {
            // Lightbox overlay
            this.lightbox.append('<div class="' + this.config.overlayClass + '"></div>');
            this.lightboxOverlay = $body.find('.' + this.config.overlayClass);
        },

        // Create gallery container
        createGalleryContainer: function() {
            // Lightbox slider wrapper
            this.lightbox.prepend('<div class="' + this.config.sliderWrapperClass + '"></div>');
            this.lightboxSliderWrapper = $body.find('.' + this.config.sliderWrapperClass);

            // Lightbox slider container
            this.lightboxSliderWrapper.prepend('<div class="' + this.config.sliderContainerClass + '"></div>');
            this.lightboxContainer = $body.find('.' + this.config.sliderContainerClass);
        },

        // Create single container
        createSingleContainer: function() {
            // Lightbox container
            this.lightbox.prepend('<div class="' + this.config.containerClass + '"></div>');
            this.lightboxContainer = $body.find('.' + this.config.containerClass);
        },

        // Create navigation
        createNavigation: function() {
            // Lightbox navigation
            var close = '<button class="' + this.config.closeClass + '"><span class="visuallyhidden">' + this.config.closeText + '</span></button>';

            if (this.config.relativeNavigation && !this.isGallery()) {
                this.lightboxContainer.append('<div class="' + this.config.navigationClass + ' is-relative">' + close + '</div>');
            } else {
                this.lightbox.append('<div class="' + this.config.navigationClass + '">' + close + '</div>');
            }

            this.lightboxNavigation = $body.find('.' + this.config.navigationClass);

            if (this.isGallery()) {
                this.createGalleryNavigation();
            }
        },

        // Create gallery navigation
        createGalleryNavigation: function() {
            // Lightbox gallery navigation
            var arrowPrev = '<button class="' + this.config.arrowPrevClass + '"><span class="visuallyhidden">' + this.config.arrowPrevText + '</span></button>',
                arrowNext = '<button class="' + this.config.arrowNextClass + '"><span class="visuallyhidden">' + this.config.arrowNextText + '</span></button>';

            this.lightboxNavigation.prepend(arrowPrev + arrowNext);

            this.lightboxPrev = this.lightboxNavigation.find('.' + this.config.arrowPrevClass);
            this.lightboxNext = this.lightboxNavigation.find('.' + this.config.arrowNextClass);

            this.bindGalleryNavigation();
        },

        // Load lightbox content
        loadContent: function(trigger, position) {
            var self = this,
                currentTrigger = trigger !== undefined ? trigger : this.trigger,
                currentPosition = position !== undefined ? position : 'append',
                type = currentTrigger.data('type'),
                contentMarkup = $('<div class="' + this.config.contentClass + '"></div>'),
                currentElement;

            // Load content based on type
            switch (type) {
                case 'youtube':
                    contentMarkup.append(this.loadYoutubeMarkup(currentTrigger));
                    break;
                case 'vimeo':
                    contentMarkup.append(this.loadVimeoMarkup(currentTrigger));
                    break;
                case 'ajax':
                    contentMarkup.append(this.loadAjaxMarkup(currentTrigger));
                    break;
                case 'map':
                    contentMarkup.append(this.loadMapMarkup(currentTrigger));
                    break;
                case 'html':
                    contentMarkup.append(this.loadHTMLMarkup(currentTrigger));
                    break;
                default:
                    contentMarkup.append(this.loadImageMarkup(currentTrigger));
            }

            contentMarkup = this.addCaptions(contentMarkup, currentTrigger);

            currentElement = $('<div class="' + this.config.sliderElementClass + '" tabindex="-1">' + contentMarkup[0].outerHTML + '</div>');

            if (currentPosition === 'append') {
                this.lightboxContainer.append(currentElement);
            } else {
                this.lightboxContainer.prepend(currentElement);
            }

            this.lightboxContent = this.lightboxContainer.find('.' + this.config.contentClass);

            this.loadEvent(currentElement);
        },

        // Youtube
        loadYoutubeMarkup: function(trigger) {
            var ID = this.getYoutubeID(trigger.attr('href')),
                markup = '<div class="iframe-container">' +
                '<iframe src="//www.youtube.com/embed/' + ID + '?wmode=transparent" frameborder="0" width="1920" height="1080" tabindex="-1" allowfullscreen></iframe>' +
                '</div>';

            return markup;
        },

        // Vimeo
        loadVimeoMarkup: function(trigger) {
            var ID = this.getVimeoID(trigger.attr('href')),
                markup = '<div class="iframe-container">' +
                '<iframe src="//player.vimeo.com/video/' + ID + '" width="1920" height="1080" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
                '</div>';

            return markup;
        },

        // Images
        loadImageMarkup: function(trigger) {
            var src = trigger.attr('href'),
                alt = trigger.data('alt'),
                markup = '<img src="' + src + '" alt="' + alt + '" />';

            return markup;
        },

        // AJAX
        loadAjaxMarkup: function(trigger) {
            var markup = '<div class="iframe-container">' +
                '<iframe src="' + trigger.attr('href') + '" width="1920" height="1080" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
                '</div>';

            return markup;
        },

        // Google Map
        loadMapMarkup: function(trigger) {
            var markup = '<div class="iframe-container">' +
                '<iframe src="' + trigger.attr('href') + '" width="1920" height="1080" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
                '</div>';

            return markup;
        },

        // HTML
        loadHTMLMarkup: function(trigger) {
            var content = trigger.find('.lightbox-html-content'),
                markup = '<div class="lightbox-bg-container">' + content.html() + '</div>';

            return markup;
        },

        // Captions
        addCaptions: function(markup, trigger) {
            var html = trigger.find('.lightbox-caption-content').html(),
                content = (html !== undefined ? html : ''),
                position = '<p class="lightbox-caption-position">' + (this.getCurrentIndex(trigger) + 1) + ' sur ' + this.getGalleryElements().length + '</p>',
                captionMarkup = '<div class="lightbox-caption-content">' + content + '</div>' + (this.config.showPositionCaption && this.isGallery() ? position : '');

            if (this.config.showCaption) {
                markup.append('<div class="lightbox-caption">' + captionMarkup + '</div>');
            }

            return markup;
        },

        // Loading event
        loadEvent: function(currentElement) {
            var self = this,
                elements = currentElement.find('img, iframe');

            elements.each(function(index, el) {
                var $el = $(el);

                self.beforeLoad($el);

                $el.on('load', function(e) {
                    self.afterLoad($(this));
                });

                $el.on('error', function(e) {
                    self.afterLoad($(this));
                    currentElement.find('.' + self.config.contentClass).html('<p class="lightbox-error">Could not load image.</p>');
                });
            });
        },

        // Called before loading
        beforeLoad: function(currentElement) {
            this.config.beforeLoad();
            currentElement.parents('.lightbox-content').addClass(this.config.beforeLoadClass);
        },


        // Called after loading
        afterLoad: function(currentElement) {
            this.config.afterLoad();

            if (this.isGallery()) {
                this.updateSliderLayout();
            }

            this.updateCaptionLayout(currentElement);

            currentElement.parents('.lightbox-content').removeClass(this.config.beforeLoadClass).addClass(this.config.afterLoadClass);
        },

        // Reset caption layout
        resetCaptionLayout: function(elements) {
            var self = this;

            elements.each(function(index, currentElement) {
                var $currentElement = $(currentElement),
                    padding = parseInt(self.lightbox.css('padding-top')) + parseInt(self.lightbox.css('padding-bottom')),
                    canvasheight = $window.height() - padding,
                    caption = $currentElement.parent().find('.lightbox-caption');

                $currentElement.css('height', canvasheight);
                caption.css('max-width', '100%');
            });
        },

        // Update caption layout
        updateCaptionLayout: function(elements) {
            var self = this;

            elements.each(function(index, currentElement) {
                for (var i = 0; i < 10; i++) {
                    var $currentElement = $(currentElement),
                        padding = parseInt(self.lightbox.css('padding-top')) + parseInt(self.lightbox.css('padding-bottom')),
                        canvasheight = $window.height() - padding,
                        caption = $currentElement.parents('.' + self.config.sliderElementClass).find('.lightbox-caption'),
                        captionHeight = caption.outerHeight(),
                        height = $currentElement.height();

                    if (height + captionHeight > canvasheight && !$currentElement.is('iframe')) {
                        $currentElement.css('height', height - captionHeight);
                    }

                    if ($currentElement.is('iframe') && !$currentElement.hasClass('resized')) {
                        $currentElement.css('max-height', height - captionHeight).addClass('resized');
                    }

                    var width = $currentElement.width();
                    caption.css('max-width', width);
                }
            });
        },

        // Resize lightbox layout
        resizeLayout: function() {
            var padding = parseInt(this.lightbox.css('padding-top')) + parseInt(this.lightbox.css('padding-bottom')),
                height = $window.height() - padding;

            this.lightboxContainer.find('img, iframe').css('max-height', height);
            this.lightboxContainer.css('max-height', height);
            this.lightboxContainer.find('iframe').removeClass('resized');

            // Keep iframe 16/9 ratio
            this.lightboxContainer.find('.iframe-container').css('max-width', height * 16 / 9);
        },

        // Update lightbox slider layout
        updateSliderLayout: function() {
            this.slides = this.lightbox.find('.' + this.config.sliderElementClass);

            this.lightboxContainer.css({
                width: 100 * this.slides.length + '%',
                left: '-100%'
            });

            this.slides.css({
                width: 100 / this.slides.length + '%',
                float: 'left'
            });
        },

        // Load previous element
        loadPrevElement: function() {
            var index = this.currentIndex - 1,
                elements = this.getGalleryElements();

            if (index < 0) {
                index = elements.length - 1;
            }

            this.loadContent(elements.eq(index), 'prepend');
        },

        // Load next element
        loadNextElement: function() {
            var index = this.currentIndex + 1,
                elements = this.getGalleryElements();

            if (index > elements.length - 1) {
                index = 0;
            }

            this.loadContent(elements.eq(index), 'append');
        },

        // Remove first element
        removeFirstElement: function() {
            this.slides.first().remove();
        },

        // Remove last element
        removeLastElement: function() {
            this.slides.last().remove();
        },

        // Change previous slide animation
        changePrevElement: function() {
            var self = this;

            window.isLightboxAnimated = true;
            this.lightboxContainer.animate({
                left: '0%',
            }, 300, function() {
                self.afterChangePrevElement();
            });
        },

        // Previous slide animation callback
        afterChangePrevElement: function() {
            this.decrementCurrentIndex();
            this.removeLastElement();
            this.loadPrevElement();
            this.updateSliderLayout();
            this.resizeLayout();
            this.updateCaptionLayout(this.lightbox.find('img, iframe'));
            window.setTimeout(function() {
                window.isLightboxAnimated = false;
            }, 100);
        },

        // Change next slide animation
        changeNextElement: function() {
            var self = this;

            window.isLightboxAnimated = true;
            this.lightboxContainer.animate({
                left: '-200%',
            }, 300, function() {
                self.afterChangeNextElement();
            });
        },

        // Next slide animation callback
        afterChangeNextElement: function() {
            this.incrementCurrentIndex();
            this.removeFirstElement();
            this.loadNextElement();
            this.updateSliderLayout();
            this.resizeLayout();
            this.updateCaptionLayout(this.lightbox.find('img, iframe'));
            window.setTimeout(function() {
                window.isLightboxAnimated = false;
            }, 100);
        },

        // Increment current slider index
        incrementCurrentIndex: function() {
            var elements = this.getGalleryElements();
            this.currentIndex++;

            if (this.currentIndex > elements.length - 1) {
                this.currentIndex = 0;
            }
        },

        // Decrement current slider index
        decrementCurrentIndex: function() {
            var elements = this.getGalleryElements();
            this.currentIndex--;

            if (this.currentIndex < 0) {
                this.currentIndex = elements.length - 1;
            }
        },

        // Initialize current sliderindex
        getCurrentIndex: function(trigger) {
            var elements = this.getGalleryElements(),
                currentTrigger = trigger !== undefined ? trigger : this.trigger,
                current = elements.filter(currentTrigger),
                currentIndex = -1;

            elements.each(function(index, el) {
                if ($(el)[0] === current[0]) {
                    currentIndex = index;
                }
            });

            return currentIndex;
        },

        // Initialize current sliderindex
        setCurrentIndex: function() {
            this.currentIndex = this.getCurrentIndex();
        },

        // Focus lightbox
        focusLightbox: function() {
            this.lightbox.attr('tabindex', -1).focus();
        },

        // Get Youtube ID from URL
        getYoutubeID: function(url) {
            // Function source: http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
            var match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
            return match[2];
        },

        // Get Vimeo ID from URL
        getVimeoID: function(url) {
            // Function source: http://jsbin.com/asuqic/184/edit
            var match = url.match(/https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
            return match[3];
        },

        // Return if current lightbox is gallery
        isGallery: function() {
            var element = this.getGalleryElements();
            return this.trigger.data('gallery') !== undefined && element.length > 1 ? true : false;
        },

        // Get current gallery ID
        getGalleryID: function() {
            return this.trigger.data('gallery');
        },

        // Get current gallery elements
        getGalleryElements: function() {
            return $body.find('.lightbox[data-gallery="' + this.getGalleryID() + '"]');
        },

        // Close and delete lightbox
        close: function() {
            if (this.lightbox) {
                this.lightbox.add(this.lightbox.next('.lightbox-guard')).hide().remove();
                this.referer.focus();
            }
        }
    };

    // jQuery plugin initialisation if VTT doesn't exist
    if (window.VTT) {
        VTT.extendComponents(Lightbox, root.charAt(0).toUpperCase() + root.slice(1));
    } else {
        $.fn[root] = function(config) {
            if (typeof config === 'string') {
                var args = Array.prototype.slice.call(arguments, 1);
                return this.each(function() {
                    var plugin = $.data(this, 'plugin_' + root);
                    plugin[config].apply(plugin, args);
                    return $(this);
                });
            } else if (!$.data(this, 'plugin_' + root)) {
                return this.each(function() {
                    if (!$.data(this, 'plugin_' + root)) {
                        $.data(this, 'plugin_' + root, new Lightbox(this, config));
                    }
                });
            }
        };
    }

})(jQuery, window, document);
