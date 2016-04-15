(function($) {
    var TemplatesFonts = function(element, options) {
        this.templatesFonts = $(element);
        this.manager = new TemplatesManager();

        this.config = $.extend({
            previewSentence: 'Libéo et les magiciens grincheux font un mélange toxique pour le mal de la Reine et Jack.',
            googleApiKey: 'AIzaSyBAcrm-Ho-fu2b_LvHJJPoIjH4iJgcV054',
            classes: {
                container: '.template-fonts-wrapper',
                template: '.template-font.is-template',
                addButton: '.btn-add-font',
                showGoogleAddFontButton: '.btn-show-add-font-google',
                showGoogleAddFontSection: '.template-fonts-add-input-wrapper-google',
                showCustomAddFontButton: '.btn-show-add-font-custom',
                showCustomAddFontSection: '.template-fonts-add-input-wrapper-custom',
                fontsDropdown: '.template-fonts-add-select',
                preview: '.template-font',
                previewName: '.template-font-name',
                previewType: '.template-font-type',
                previewVariances: '.template-font-preview',
                previewVariance: '.template-font-preview-variance',
                previewDeleteButton: '.btn-remove-font'
            },
            customGlobalClasses: {}
        }, options || {});

        this.globalClasses = $.extend({
            active: 'is-active',
            open: 'is-open',
            hover: 'is-hover',
            clicked: 'is-clicked',
            extern: 'is-external',
            error: 'is-error'
        }, (window.classes !== undefined ? window.classes : this.config.customGlobalClasses) || {});

        this.$container = $(this.config.classes.container);
        this.$template = $(this.config.classes.template);
        this.$showGoogleAddFontButton = $(this.config.classes.showGoogleAddFontButton);
        this.$showGoogleAddFontSection = $(this.config.classes.showGoogleAddFontSection);
        this.$showCustomAddFontButton = $(this.config.classes.showCustomAddFontButton);
        this.$showCustomAddFontSection = $(this.config.classes.showCustomAddFontSection);
        this.$addButton = this.$container.find(this.config.classes.addButton);

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

            this.$addButton.on('click', $.proxy(function() {
                // this.createFontPreview({
                //     name: 'c-',
                //     value: '#',
                // }, true);
            }, this));

            this.manager.$generateButton.on('click', $.proxy(this.generateJSON, this));
            this.manager.$importButton.on('click', $.proxy(this.importJSON, this));
            this.manager.$downloadButton.on('click', $.proxy(this.downloadJSON, this));

            $(document).on('googleCallback', $.proxy(this.loadGoogleFontsAPI, this));
        },

        loadJSON: function() {
            this.manager.getJSON($.proxy(this.loadFonts, this));
        },

        loadFonts: function(data) {
            this.$container.find(this.config.classes.preview).remove();

            for (var index in data.fonts) {
                var font = data.fonts[index];

                this.createFontPreview(font, false);
            }
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

        loadGoogleFont: function(family, weight) {
            WebFont.load({
                google: {
                    families: [family + ':' + weight]
                }
            });
        },

        createFontPreview: function(font, editable) {
            var $preview = this.$template.clone().removeClass('is-template');
            var $previewName = $preview.find(this.config.classes.previewName);
            var $previewType = $preview.find(this.config.classes.previewType);
            var $deleteButton = $preview.find(this.config.classes.previewDeleteButton);

            $previewName.text(font.name);
            $previewType.text(font.type);

            this.createFontPreviewVariances($preview, font);

            if (!editable) {
                $deleteButton.hide();
            } else {
                $deleteButton.on('click', $.proxy(function(event) {
                    this.deleteFontPreview($preview);
                }, this));
            }

            this.$container.append($preview);
        },

        createFontPreviewVariances: function($preview, font) {
            var $previewVariances = $preview.find(this.config.classes.previewVariances);

            for (var index in font.variances) {
                var variance = font.variances[index];
                var fontWeight = 'normal';
                var fontStyle = 'normal';

                if (/^\d+$/.test(variance) || variance === 'regular') {
                    fontWeight = variance;
                } else if (/^\D+$/.test(variance)) {
                    fontStyle = variance;
                } else {
                    var matches = variance.match(/(\d+)(\w+)/);
                    fontWeight = matches[1];
                    fontStyle = matches[2];
                }

                $previewVariance = $('<p class="template-font-preview-' + fontWeight + '"></p>');
                $previewVariance.addClass(this.config.classes.previewVariance.replace('.', ''));
                $previewVariance.text(this.config.previewSentence);
                $previewVariance.attr('data-font-variances', variance);
                $previewVariance.css({
                    fontWeight: fontWeight,
                    fontStyle: fontStyle
                });

                $previewVariances.append($previewVariance);
            }
        },

        updateFontsDropdown: function(fonts) {
            var fontsDropdown = $(this.config.classes.fontsDropdown);

            fontsDropdown.each(function(index, element) {
                var $element = $(element);
                for (var index in fonts) {
                    var font = fonts[index].family;
                    var weight = fonts[index].variants.join();
                    $element.append('<option value="' + font + '" data-weight="' + weight + '">' + font + '</option>');
                }
            });

            //fontsDropdown.on('change', updateFontsWeights).trigger('change');
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
        },

        getNewJSON: function() {
            var currentJSON = this.manager.getJSON();
            var fonts = this.$container.find(this.config.classes.preview);

            currentJSON.fonts = [];

            fonts.each($.proxy(function(index, element) {
                var $element = $(element);
                var $varianceElements = $element.find(this.config.classes.previewVariance);
                var name = $element.find(this.config.classes.previewName).text();
                var type = $element.find(this.config.classes.previewType).text();
                var font = {};

                font.name = name;
                font.type = type;
                font.variances = [];

                $varianceElements.each(function(index, element) {
                    var $element = $(element);
                    var variance = $element.attr('data-font-variances');
                    console.log(variance);
                    font.variances.push(variance);
                });

                currentJSON.fonts.push(font);
            }, this));

            currentJSON.lastUpdated = new Date().getTime();

            return currentJSON;
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
