(function($) {
    var TemplatesTypography = function(element, options) {
        this.templatesTypography = $(element);
        this.manager = new TemplatesManager();

        // Default module configuration
        this.defaults = {
            mainFontAlertMessage: 'Aucune font principale trouvée. Vous devez définir une font principale avant de continuer.',
            classes: {
                wrapper: '.template-typography-wrapper',
                container: '.template-typography-edit-panel-wrapper',
                panelWrapper: '.template-typography-edit-panel',
                panel: '.template-typography-edit-panel-inputs',
                template: '.template-typography-edit-panel-inputs.is-template',
                selectorsDropdown: '.template-typography-edit-selector',
                breakpointsDropdown: '.template-typography-edit-breakpoint',
                fontFamilyDropdown: '.template-typography-edit-font-family',
                fontWeightDropdown: '.template-typography-edit-font-weight',
                fontStylesDropdown: '.template-typography-edit-font-style',
                colorsDropdown: '.template-typography-edit-color',
                typographyInput: '.template-typography-input',
                previewWrapper: '.template-typography-preview',
                previewContainer: '.template-typography-preview-container'
            }
        };

        // Merge default classes with window.project.classes
        this.classes = $.extend(true, this.defaults.classes, window.project.classes || {});

        // Merge default config with custom config
        this.config = $.extend(true, this.defaults, options || {});

        this.$wrapper = $(this.classes.wrapper);
        this.$container = $(this.classes.container);
        this.$previewWrapper = $(this.classes.previewWrapper);
        this.$previewContainer = $(this.classes.previewContainer);
        this.$panelWrapper = $(this.classes.panelWrapper);
        this.$template = $(this.classes.template);
        this.$selectorsDropdown = $(this.classes.selectorsDropdown);
        this.$breakpointsDropdown = $(this.classes.breakpointsDropdown);

        this.isShiftPressed = false;
        this.isAltPressed = false;

        this.init();
    };

    $.extend(TemplatesTypography.prototype, {

        // Component initialization
        init: function() {
            this.bindEvents();
            this.loadJSON();
            this.stickOnScroll();
        },

        loadTypography: function(data) {
            this.$container.html('');

            for (var index in data.typography) {
                var selector = data.typography[index].selector;
                var type = data.typography[index].type;
                var properties = data.typography[index].properties;
                var breakpoints = data.typography[index].breakpoints;
                var $element = this.$template.clone();
                var $fontWeightsDropdown = $element.find(this.classes.fontWeightDropdown);
                var $fontStylesDropdown = $element.find(this.classes.fontStylesDropdown);
                var $colorsDropdown = $element.find(this.classes.colorsDropdown);

                if (type === 'id') { selector = '#' + selector; }
                if (type === 'class') { selector = '.' + selector; }

                this.updateFontWeightsDropdown($fontWeightsDropdown, properties['font-family']);
                this.updateFontStylesDropdown($fontStylesDropdown, properties['font-family'], properties['font-weight']);
                this.updateColorsDropdown($colorsDropdown, data.colors);

                // Initialize each properties
                for (var index in properties) {
                    var property = index;
                    var value = properties[index];
                    var $input = $element.find('[data-edit="' + property + '"]');

                    $input.val(value);
                    $input.attr('data-breakpoint-default', value);

                    if (property === 'color') value = this.getColorValue(value);
                    if (property === 'font-family') $input.attr('data-font-family', value);

                    this.updateTypographyPreview(selector, property, value);
                }

                // Initialize each breakpoint properties
                for (var index in breakpoints) {
                    var breakpoint = index;
                    var properties = breakpoints[index];
                    for (var index in properties) {
                        var property = index;
                        var value = properties[index];
                        var $input = $element.find('[data-edit="' + property + '"]');
                        $input.attr('data-breakpoint-' + breakpoint, value);
                    }
                }

                // Append each edit panel
                $element.attr('data-selector', selector);
                $element.attr('data-type', type);
                $element.removeClass('is-template');
                this.$container.append($element);

                // Bind preview click event
                $(this.classes.previewWrapper + ' ' + selector).off('click', $.proxy(this.onPreviewTypographyClick, this));
                $(this.classes.previewWrapper + ' ' + selector).on('click', $.proxy(this.onPreviewTypographyClick, this));
            }

            var mainFonts = data.fonts.filter(function(font) {
                return font.main === true;
            });

            if (mainFonts.length === 0) this.createMainFontAlert();

            this.loadSelectorsDropdown(data.typography);
            this.loadBreakpointsDropdown(data.breakpoints);
            this.updateCurrentSelectedTypography('h1', false);
            this.updateFontDropdowns(data.fonts);

            this.manager.finishLoading();
        },

        bindEvents: function() {
            this.manager.$generateButton.on('click', $.proxy(this.generateJSON, this));
            this.manager.$importButton.on('click', $.proxy(this.importJSON, this));
            this.manager.$downloadButton.on('click', $.proxy(this.downloadJSON, this));

            $(document).on('change', this.classes.selectorsDropdown, $.proxy(function(event) {
                var selector = $(event.currentTarget).val();

                this.updateCurrentSelectedTypography(selector, true);
            }, this));

            $(document).on('change', this.classes.breakpointsDropdown, $.proxy(function(event) {
                var breakpoint = $(event.currentTarget).val();

                this.updateCurrentSelectedBreakpoint(breakpoint);
            }, this));

            $(document).on('change', this.classes.fontFamilyDropdown, $.proxy(function(event) {
                var fontFamily = $(event.currentTarget).val();
                var $currentPanel = $(this.classes.panel + '.is-active');
                var $fontWeightsDropdown = $currentPanel.find(this.classes.fontWeightDropdown);

                this.updateFontWeightsDropdown($fontWeightsDropdown, fontFamily);
            }, this));

            $(document).on('change', this.classes.fontWeightDropdown, $.proxy(function(event) {
                var $currentPanel = $(this.classes.panel + '.is-active');
                var $fontFamilyDropdown = $currentPanel.find(this.classes.fontFamilyDropdown);
                var $fontStylesDropdown = $currentPanel.find(this.classes.fontStylesDropdown);
                var fontFamily = $fontFamilyDropdown.val();
                var fontWeight = $(event.currentTarget).val();

                this.updateFontStylesDropdown($fontStylesDropdown, fontFamily, fontWeight);
            }, this));

            $(document).on('change', this.classes.typographyInput, $.proxy(function(event) {
                var selector = $(this.classes.selectorsDropdown).val();
                var $element = $(event.currentTarget);
                var property = $element.attr('data-edit');
                var value = $element.val();

                if (property === 'color') value = this.getColorValue(value);

                this.updateTypographyPreview(selector, property, value);
                this.updateInputBreakpointProperty($element);
                this.updateLocalJSON();
            }, this));

            $(document).on('keydown', this.classes.typographyInput, $.proxy(function(event) {
                var variance = 0;
                var $element = $(event.currentTarget);

                if (event.keyCode === 16) { // Shift
                    this.isShiftPressed = true;
                } else if (event.keyCode === 18) { // Alt
                    this.isAltPressed = true;
                } else if (event.keyCode === 38) { // Up arrow
                    variance = 1;
                    this.adjustInputValue($element, variance);
                } else if (event.keyCode === 40) { // Down arrow
                    variance = -1;
                    this.adjustInputValue($element, variance);
                }
            }, this));

            $(document).on('mousewheel', this.classes.typographyInput + '[type="text"]', $.proxy(function(event) {
                var variance = (event.originalEvent.wheelDelta > 0 ? 1 : -1);
                var $element = $(event.currentTarget);

                this.adjustInputValue($element, variance);
                event.preventDefault();
            }, this));

            $(document).on('keyup', this.classes.typographyInput, $.proxy(function(event) {
                if (event.keyCode === 16) this.isShiftPressed = false;
                if (event.keyCode === 18) this.isAltPressed = false;
            }, this));
        },

        loadSelectorsDropdown: function(typography) {
            this.$selectorsDropdown.html('');

            for (var index in typography) {
                var selector = typography[index].selector;
                var type = typography[index].type;

                if (type === 'id') { selector = '#' + selector; }
                if (type === 'class') { selector = '.' + selector; }

                var $option = $('<option value="' + selector + '" data-type="' + type + '">' + selector + '</option>');

                this.$selectorsDropdown.append($option);
            }
        },

        loadBreakpointsDropdown: function(breakpoints) {
            this.$breakpointsDropdown.html('');

            // Create 'default' option
            var $option = $('<option value="default">-</option>');
            this.$breakpointsDropdown.append($option);

            for (var index in breakpoints) {
                var name = breakpoints[index].name;
                var $option = $('<option value="' + name + '">' + name + '</option>');

                this.$breakpointsDropdown.append($option);
            }
        },

        updateCurrentSelectedTypography: function(selector, scroll) {
            var selectedOption = $(this.classes.selectorsDropdown).find('option:selected');
            var type = selectedOption.attr('data-type');

            $(this.classes.panel)
                .removeClass(this.classes.states.active)
                .filter('[data-selector="' + selector + '"]')
                .addClass(this.classes.states.active);
            $('.l-block-content .' + this.classes.states.editing).removeClass(this.classes.states.editing);

            if (type === 'element') {
                // Only return elements with no classes or ID
                var $element = $(this.classes.previewWrapper + ' ' + selector).filter(function(index) {
                    return this.classList.length === 0 && this.id === '';
                });
                $element.addClass(this.classes.states.editing);
            } else {
                var $element = $(selector)
                $element.addClass(this.classes.states.editing);
            }

            if (scroll) this.scrollToElement($element);
            this.updateCurrentBreakpointProperties();
        },

        updateCurrentSelectedBreakpoint: function(breakpoint) {
            var $panels = $(this.classes.panel + ':not(.is-template)');

            $panels.each($.proxy(function(index, element) {
                var $panel = $(element);
                var selector = $(element).attr('data-selector');
                var $inputs = $panel.find(this.classes.typographyInput);

                $inputs.each($.proxy(function(index, element) {
                    var $element = $(element);
                    var property = $element.attr('data-edit');
                    var value = $element.attr('data-breakpoint-' + breakpoint);

                    if (value === undefined) value = $element.attr('data-breakpoint-default');
                    $element.val(value);

                    if (property === 'color') value = this.getColorValue(value);
                    this.updateTypographyPreview(selector, property, value);
                }, this));
            }, this));

            if (breakpoint === 'mobile') {
                this.$previewContainer.addClass('is-mobile');
            } else {
                this.$previewContainer.removeClass('is-mobile');
            }
        },

        updateInputBreakpointProperty: function($element) {
            var currentBreakpoint = $(this.classes.breakpointsDropdown).find('option:selected').val();
            $element.attr('data-breakpoint-' + currentBreakpoint, $element.val());
        },

        updateCurrentBreakpointProperties: function() {
            var currentBreakpoint = $(this.classes.breakpointsDropdown).find('option:selected').val();
            var $inputs = $(this.classes.panel).find(this.classes.typographyInput);

            $inputs.each(function(index, element) {
                var $element = $(element);
                var value = $element.val();
                if (value !== null) $element.attr('data-breakpoint-' + currentBreakpoint, value);
            });
        },

        updateFontWeightsDropdown: function($dropdown, fontFamily) {
            var weights = this.getFontWeights(fontFamily);
            var currentValue = $dropdown.val();

            $dropdown.html('');

            for (var index in weights) {
                var weight = weights[index];
                $dropdown.append('<option value="' + weight + '" ' + (weight === currentValue ? 'selected="selected"' : '') + '>' + weight + '</option>');
            }

            $dropdown.trigger('change');
        },

        updateFontStylesDropdown: function($dropdown, fontFamily, fontWeight) {
            var styles = this.getFontStyles(fontFamily, fontWeight);
            var currentValue = $dropdown.val();

            $dropdown.html('');

            for (var index in styles) {
                var style = styles[index];
                $dropdown.append('<option value="' + style + '" ' + (style === currentValue ? 'selected="selected"' : '') + '>' + style + '</option>');
            }

            $dropdown.trigger('change');
        },

        updateColorsDropdown: function($dropdown, colors) {
            for (var index in colors) {
                var name = colors[index].name;
                var color = colors[index].value;
                $dropdown.append('<option value="' + name + '">' + name + '</option>');
            }
        },

        updateFontDropdowns: function(fonts) {
            var $fontDropdowns = $('.template-typography-edit-font-family');

            $fontDropdowns.each(function(index, element) {
                var $element = $(element);
                var currentFontFamily = $element.attr('data-font-family');
                for (var index in fonts) {
                    var font = fonts[index].name;
                    $element.append('<option value="' + font + '" ' + (currentFontFamily === font ? "selected" : "") + '>' + font + '</option>');
                }
            });
        },

        updateTypographyPreview: function(selector, property, value) {
            $(this.classes.previewWrapper + ' ' + selector).css(property, value).attr('data-selector', selector);
            $(this.classes.previewWrapper + ' :first-child').not('li > ul').not('li > ol').css('margin-top', '0');
            $(this.classes.previewWrapper + ' :last-child').not('li > ul').not('li > ol').css('margin-bottom', '0');
        },

        adjustInputValue: function($element, variance) {
            if (this.isShiftPressed) variance = variance * 10;
            if (this.isAltPressed) variance = variance * 0.10;

            var initialValue = $element.val();
            var matches = initialValue.match(/(.*\d+)(.+)/);
            var value = parseFloat((matches !== null ? matches[1] : 0));
            var unit = (matches !== null ? matches[2] : 'px');
            var newValue = (value * 1000 + variance * 1000) / 1000;

            $element.val(newValue + unit);
            $element.trigger('change');
        },

        onPreviewTypographyClick: function(event) {
            var $element = $(event.currentTarget);
            var selector = $element.attr('data-selector').toLowerCase();

            $(this.classes.selectorsDropdown).val(selector);
            this.updateCurrentSelectedTypography(selector, false);

            event.stopPropagation();
            event.preventDefault();
        },

        scrollToElement: function($element) {
            var offset = $element.offset().top - 50;

            $('html, body').animate({ scrollTop: offset });
        },

        stickOnScroll: function() {
            var offset = this.$panelWrapper.offset().top;

            $(window).on('scroll', $.proxy(function() {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > offset) {
                    this.$panelWrapper.addClass('is-fixed');
                } else {
                    this.$panelWrapper.removeClass('is-fixed');
                }
            }, this)).trigger('scroll');
        },

        createMainFontAlert: function() {
            this.$wrapper.prepend('<p class="main-font-alert editing-element">' + this.config.mainFontAlertMessage + '</p>')
        },

        getFontWeights: function(fontFamily) {
            var currentJSON = this.manager.getJSON();
            var fontWeights = [];

            var matchingFonts = currentJSON.fonts.filter(function(font) {
                return font.name == fontFamily
            });

            for (var index in matchingFonts) {
                var currentFont = matchingFonts[index];
                var currentFontVariants = currentFont.variants;
                for (var index in currentFontVariants) {
                    var currentFontWeight = currentFontVariants[index];
                    if (/^\d+$/.test(currentFontWeight)) {
                        fontWeights.push(currentFontWeight);
                    } else {
                        var matches = currentFontWeight.match(/(\d+)(\w+)/);
                        if (matches && fontWeights.indexOf(matches[1]) === -1) {
                            fontWeights.push(matches[1]);
                        }
                    }
                }
            }

            return fontWeights;
        },

        getFontStyles: function(fontFamily, fontWeight) {
            var currentJSON = this.manager.getJSON();
            var fontStyles = ['normal'];

            var matchingFonts = currentJSON.fonts.filter(function(font) {
                return font.name == fontFamily
            });

            for (var index in matchingFonts) {
                var currentFont = matchingFonts[index];
                var currentFontVariants = currentFont.variants;
                for (var index in currentFontVariants) {
                    var currentFontStyle = currentFontVariants[index];
                    if (/^[a-zA-Z]+$/.test(currentFontStyle)) {
                        // Current font style is only letters (italic) so font-weight is 400 (regular)
                        currentFontStyle = '400' + currentFontStyle;
                    }
                    if (currentFontStyle.startsWith(fontWeight)) {
                        var fontStyle = currentFontStyle.replace(fontWeight, '');
                        if (fontStyle !== '' && fontStyles.indexOf(fontStyle) === -1) {
                            fontStyles.push(fontStyle);
                        }
                    }
                }
            }

            return fontStyles;
        },

        getColorValue: function(name) {
            var currentJSON = this.manager.getJSON();
            var currentColor = currentJSON.colors.filter(function(color) {
                return color.name === name;
            });

            return currentColor[0].value;
        },

        getNewJSON: function() {
            var currentJSON = this.manager.getJSON();
            var panels = $(this.classes.panel + ':not(.is-template)');

            // Reset current typography
            currentJSON.typography = [];

            panels.each($.proxy(function(index, element) {
                var $element = $(element);
                var selector = $element.attr('data-selector').replace('.', '').replace('#', '');
                var type = $element.attr('data-type');
                var inputs = $element.find(this.classes.typographyInput);
                var currentTypography = {};

                currentTypography.selector = selector;
                currentTypography.type = type;
                currentTypography.properties = {};
                currentTypography.breakpoints = {};

                inputs.each(function(index, element) {
                    var $input = $(element);
                    var property = $input.attr('data-edit');
                    var value = $input.attr('data-breakpoint-default');
                    currentTypography.properties[property] = value;

                    for (var index in currentJSON.breakpoints) {
                        var breakpoint = currentJSON.breakpoints[index].name;
                        var breakpointValue = $input.attr('data-breakpoint-' + breakpoint);
                        if (breakpointValue !== undefined) {
                            currentTypography.breakpoints[breakpoint] = currentTypography.breakpoints[breakpoint] || {};
                            currentTypography.breakpoints[breakpoint][property] = breakpointValue;
                        }
                    }
                });

                currentJSON.typography.push(currentTypography);
            }, this));

            currentJSON.lastUpdated = new Date().getTime();

            return currentJSON;
        },

        loadJSON: function() {
            this.manager.getJSON($.proxy(this.loadTypography, this));
        },

        updateLocalJSON: function() {
            var currentJSON = this.getNewJSON();

            this.manager.saveLocalJSON(currentJSON);
        },

        generateJSON: function() {
            var currentJSON = this.getNewJSON();

            this.manager.updateJSON(currentJSON);
        },

        importJSON: function() {
            var importJSON = this.manager.getImportJSON();

            if (importJSON) {
                this.loadTypography(importJSON);
                this.updateLocalJSON();
            }
        },

        downloadJSON: function() {
            var currentJSON = this.getNewJSON();

            this.manager.downloadJSON(currentJSON);
        }

    });

    $.fn.templatesTypography = function(options) {
        return this.each(function() {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('templatesTypography')) return;

            // pass options to plugin constructor
            var templatesTypography = new TemplatesTypography(this, options);

            // Store plugin object in this element's data
            element.data('templatesTypography', templatesTypography);
        });
    };
})(jQuery);
