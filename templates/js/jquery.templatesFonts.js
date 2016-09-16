(function($) {
    var TemplatesFonts = function(element, options) {
        this.templatesFonts = $(element);
        this.manager = new TemplatesManager();

        // Default module configuration
        this.defaults = {
            previewSentence: 'Libéo et les magiciens grincheux font un mélange toxique pour le mal de la Reine et Jack.',
            customFontVariants: ['100', '100italic', '300', '300italic', '400', '400italic', '500', '500italic', '600', '600italic', '700', '700italic', '800', '800italic', '900', '900italic'],
            googleApiKey: 'AIzaSyBAcrm-Ho-fu2b_LvHJJPoIjH4iJgcV054',
            classes: {
                container: '.template-fonts-wrapper',
                template: '.template-font.is-template',
                addButton: '.btn-add-font',
                showGoogleAddFontButton: '.btn-show-add-font-google',
                showGoogleAddFontSection: '.template-fonts-add-input-wrapper[data-type="google"]',
                showCustomAddFontButton: '.btn-show-add-font-custom',
                showCustomAddFontSection: '.template-fonts-add-input-wrapper[data-type="custom"]',
                fontsDropdown: '.template-fonts-add-select',
                addFontElementWrapper: '.template-fonts-add-input-wrapper',
                addFontElement: '.template-fonts-add-element',
                addFontCheckbox: '.template-fonts-add-font-checkbox',
                addFontGoogleButton: '.template-fonts-show-google-font',
                addFontVariantsWrapper: '.template-fonts-add-font-variants',
                preview: '.template-font',
                previewInput: '.template-font-input',
                previewName: '.template-font-name',
                previewType: '.template-font-type',
                previewVariants: '.template-font-preview',
                previewVariant: '.template-font-preview-variant',
                previewDeleteButton: '.btn-remove-font'
            },
        };

        // Merge default classes with window.project.classes
        this.classes = $.extend(true, this.defaults.classes, window.project.classes || {});

        // Merge default config with custom config
        this.config = $.extend(true, this.defaults, options || {});

        this.$container = $(this.classes.container);
        this.$template = $(this.classes.template);
        this.$showGoogleAddFontButton = $(this.classes.showGoogleAddFontButton);
        this.$showGoogleAddFontSection = $(this.classes.showGoogleAddFontSection);
        this.$showCustomAddFontButton = $(this.classes.showCustomAddFontButton);
        this.$showCustomAddFontSection = $(this.classes.showCustomAddFontSection);
        this.$addButton = $(this.classes.addButton);
        this.$addFontGoogleButton = $(this.classes.addFontGoogleButton);

        this.init();
    };

    $.extend(TemplatesFonts.prototype, {

        init: function() {
            this.bindEvents();
            this.loadJSON();
        },

        bindEvents: function() {
            this.$showGoogleAddFontButton.on('click', $.proxy(this.showGoogleAddFontSection, this));
            this.$showCustomAddFontButton.on('click', $.proxy(this.showCustomAddFontSection, this));

            this.$addButton.on('click', $.proxy(function(event) {
                var type = $(event.currentTarget).attr('data-type');
                this.createNewFontPreview(type);
            }, this));

            this.$addFontGoogleButton.on('click', $.proxy(function() {
                var selectedFont = $(this.classes.fontsDropdown).val();
                window.open('https://www.google.com/fonts/specimen/' + selectedFont, '_blank');
            }, this));

            this.manager.$generateButton.on('click', $.proxy(this.generateJSON, this));
            this.manager.$importButton.on('click', $.proxy(this.importJSON, this));
            this.manager.$downloadButton.on('click', $.proxy(this.downloadJSON, this));

            $(document).on('googleCallback', $.proxy(this.loadGoogleFontsAPI, this));
        },

        loadFonts: function(data) {
            this.$container.find(this.classes.preview).remove();

            for (var index in data.fonts) {
                var font = data.fonts[index];

                this.createFontPreview(font, false);
            }

            window.setTimeout($.proxy(function() {
                this.manager.finishLoading();
            }, this), 100);
        },

        loadGoogleFontsAPI: function() {
            gapi.client.setApiKey(this.config.googleApiKey);
            gapi.client.load('webfonts', 'v1', $.proxy(function() {
                var request = gapi.client.webfonts.webfonts.list();
                request.execute($.proxy(function(resp) {
                    fonts = resp.items;
                    this.updateFontsDropdown(fonts);
                }, this));
            }, this));
        },

        loadGoogleFont: function(family, variants) {
            WebFont.load({
                google: {
                    families: [family + ':' + variants]
                }
            });
        },

        createNewFontPreview: function(type) {
            var $addFontWrapper = $(this.classes.addFontElementWrapper + ':visible');
            var font = {};

            font.name = $addFontWrapper.find(this.classes.addFontElement).val();
            font.type = type;
            font.variants = [];

            var variants = $addFontWrapper.find(this.classes.addFontCheckbox + ':checked');
            variants.each(function(index, element) {
                font.variants.push($(element).val());
            });

            if (font.name !== '') {
                this.createFontPreview(font, true);
                this.updateLocalJSON();
            }
        },

        createFontPreview: function(font, editable) {
            var $preview = this.$template.clone().removeClass('is-template');
            var $previewInput = $preview.find(this.classes.previewInput);
            var $previewName = $preview.find(this.classes.previewName);
            var $previewType = $preview.find(this.classes.previewType);
            var $deleteButton = $preview.find(this.classes.previewDeleteButton);

            $previewInput.attr('id', font.name.toLowerCase().replace(' ', '-'));
            $previewName.text(font.name);
            $previewType.text(font.type);

            this.createFontPreviewVariants($preview, font);

            if (font.type === 'google') {
                this.loadGoogleFont(font.name, font.variants.join());
            }

            if (font.main) {
                $previewInput.attr('checked', 'checked');
            }

            $previewInput.on('change', $.proxy(function() {
                this.updateMainFont(font);
            }, this));

            if (!editable) {
                $deleteButton.hide();
            } else {
                $deleteButton.on('click', $.proxy(function(event) {
                    this.deleteFontPreview($preview);
                }, this));
            }

            this.$container.append($preview);
        },

        createFontPreviewVariants: function($preview, font) {
            var $previewVariants = $preview.find(this.classes.previewVariants);

            for (var index in font.variants) {
                var variant = font.variants[index];
                var fontWeight = 'normal';
                var fontStyle = 'normal';

                if (/^\d+$/.test(variant) || variant === 'regular') {
                    fontWeight = variant;
                } else if (/^\D+$/.test(variant)) {
                    fontStyle = variant;
                } else {
                    var matches = variant.match(/(\d+)(\w+)/);
                    fontWeight = matches[1];
                    fontStyle = matches[2];
                }

                $previewVariant = $('<p class="template-font-preview-' + fontWeight + '"></p>');
                $previewVariant.addClass(this.classes.previewVariant.replace('.', ''));
                $previewVariant.text(this.config.previewSentence);
                $previewVariant.attr('data-font-variants', variant);
                $previewVariant.css({
                    fontFamily: font.name,
                    fontWeight: fontWeight,
                    fontStyle: fontStyle
                });

                $previewVariants.append($previewVariant);
            }
        },

        updateFontsDropdown: function(fonts) {
            this.fontsDropdown = $(this.classes.fontsDropdown);

            this.fontsDropdown.each(function(index, element) {
                var $element = $(element);
                for (var index in fonts) {
                    var font = fonts[index].family;
                    var variants = fonts[index].variants.join();
                    $element.append('<option value="' + font + '" data-variants="' + variants + '">' + font + '</option>');
                }
            });

            this.fontsDropdown.on('change', $.proxy(function() {
                var selectedOption = this.fontsDropdown.find('option:selected');
                var variants = selectedOption.attr('data-variants').split(',');

                this.updateAddFontVariants(variants, 'google');
            }, this)).trigger('change');
        },

        updateMainFont: function(font) {
            var currentJSON = this.manager.getJSON();

            for (var index in currentJSON.typography) {
                var properties = currentJSON.typography[index].properties;
                if (properties['font-family'] === 'sans-serif') {
                    properties['font-family'] = font.name;
                }
            }

            this.updateLocalJSON(currentJSON);
        },

        updateAddFontVariants: function(variants, type) {
            if (type === 'google') {
                var $container = this.$showGoogleAddFontSection.find(this.classes.addFontVariantsWrapper);
            } else {
                var $container = this.$showCustomAddFontSection.find(this.classes.addFontVariantsWrapper);
            }

            // Reset variants
            $container.html('');

            for (var index in variants) {
                var $element = $('.template-fonts-add-font-variants-wrapper.is-template').clone();
                var variant = (variants[index] === 'regular' ? '400' : variants[index]);
                var label = $element.find('label');
                var checkbox = $element.find('input');
                var identifier = 'template-fonts-add-font-variants-' + variant;

                label.attr('for', identifier).find('span').text(variant);
                checkbox.attr('id', identifier).val(variant);
                $element.removeClass('is-template');

                if (variant === '400') {
                    checkbox.attr('checked', 'checked');
                }

                $container.append($element);
            }
        },

        deleteFontPreview: function($preview) {
            $preview.remove();
        },

        showGoogleAddFontSection: function() {
            this.$showGoogleAddFontButton.hide();
            this.$showGoogleAddFontSection.show();
            this.$showCustomAddFontButton.show();
            this.$showCustomAddFontSection.hide();
        },

        showCustomAddFontSection: function() {
            this.$showGoogleAddFontButton.show();
            this.$showGoogleAddFontSection.hide();
            this.$showCustomAddFontButton.hide();
            this.$showCustomAddFontSection.show();

            this.updateAddFontVariants(this.config.customFontVariants, 'custom');
        },

        getNewJSON: function(JSON) {
            var currentJSON = JSON || this.manager.getJSON();
            var fonts = this.$container.find(this.classes.preview);

            currentJSON.fonts = [];

            fonts.each($.proxy(function(index, element) {
                var $element = $(element);
                var $variantElements = $element.find(this.classes.previewVariant);
                var main = $element.find(this.classes.previewInput).is(':checked');
                var name = $element.find(this.classes.previewName).text();
                var type = $element.find(this.classes.previewType).text();
                var font = {};

                font.name = name;
                font.type = type;
                font.main = main;
                font.variants = [];

                $variantElements.each(function(index, element) {
                    var $element = $(element);
                    var variant = $element.attr('data-font-variants');
                    font.variants.push(variant);
                });

                currentJSON.fonts.push(font);
            }, this));

            currentJSON.lastUpdated = new Date().getTime();

            return currentJSON;
        },

        loadJSON: function() {
            this.manager.getJSON($.proxy(this.loadFonts, this));
        },

        updateLocalJSON: function(JSON) {
            var currentJSON = this.getNewJSON(JSON);

            this.manager.saveLocalJSON(currentJSON);
        },

        generateJSON: function() {
            var currentJSON = this.getNewJSON();

            this.manager.updateJSON(currentJSON);
        },

        importJSON: function() {
            var importJSON = this.manager.getImportJSON();

            if (importJSON) {
                this.loadFonts(importJSON);
                this.updateLocalJSON();
            }
        },

        downloadJSON: function() {
            var currentJSON = this.getNewJSON();

            this.manager.downloadJSON(currentJSON);
        }
    });

    $.fn.templatesFonts = function(options) {
        return this.each(function() {
            var element = $(this);

            if (element.data('templatesFonts')) return;

            var templatesFonts = new TemplatesFonts(this, options);
            element.data('templatesFonts', templatesFonts);
        });
    };
})(jQuery);
