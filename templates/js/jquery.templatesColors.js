(function($) {
    var TemplatesColors = function(element, options) {
        this.templatesColors = $(element);
        this.manager = new TemplatesManager();

        this.config = $.extend({
            classes: {
                container: '.template-colors-wrapper',
                template: '.template-color.is-template',
                addButton: '.btn-add-color',
                preview: '.template-color',
                previewName: '.template-color-name',
                previewValue: '.template-color-value',
                previewColor: '.template-color-preview',
                previewDescription: '.template-color-description',
                previewDeleteButton: '.btn-remove-color'
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
        this.$addButton = this.$container.find(this.config.classes.addButton);

        this.init();
    };

    $.extend(TemplatesColors.prototype, {

        init: function() {
            this.bindEvents();
            this.loadJSON();
        },

        bindEvents: function() {
            this.$addButton.on('click', $.proxy(function() {
                this.createColorPreview({
                    name: 'c-',
                    value: '#',
                }, true);
            }, this));

            this.manager.$generateButton.on('click', $.proxy(this.generateJSON, this));
            this.manager.$importButton.on('click', $.proxy(this.importJSON, this));
            this.manager.$downloadButton.on('click', $.proxy(this.downloadJSON, this));
        },

        loadJSON: function() {
            this.manager.getJSON($.proxy(this.loadColors, this));
        },

        loadColors: function(data) {
            this.$container.find(this.config.classes.preview).remove();

            for (var name in data.colors) {
                var color = {};
                color.name = name;
                color.value = data.colors[name].value;
                color.description = data.colors[name].description;

                this.createColorPreview(color, false);
            }
        },

        createColorPreview: function(color, editable) {
            var $element = this.$template.clone().removeClass('is-template');
            var $previewName = $element.find(this.config.classes.previewName);
            var $previewValue = $element.find(this.config.classes.previewValue);
            var $previewDescription = $element.find(this.config.classes.previewDescription);
            var $previewColor = $element.find(this.config.classes.previewColor);
            var $deleteButton = $element.find(this.config.classes.previewDeleteButton);

            $previewName.val(color.name);
            $previewValue.val(color.value);
            $previewDescription.val(color.description);
            $previewColor.css('background-color', color.value);

            if (!editable) {
                $deleteButton.hide();
                $element.find(this.config.classes.previewName).attr('readonly', 'true');
            } else {
                $deleteButton.on('click', $.proxy(function(event) {
                    this.deleteColorPreview($element);
                }, this));
            }

            $element.find(this.config.classes.previewValue).on('change', $.proxy(function(event) {
                this.updateColorPreview($element);
            }, this));

            this.$addButton.before($element);
        },

        updateColorPreview: function($preview) {
            var color = $preview.find(this.config.classes.previewValue).val();

            $preview.find(this.config.classes.previewColor).css('background-color', color);
            this.updateLocalJSON();
        },

        deleteColorPreview: function($preview) {
            $preview.remove();
        },

        getNewJSON: function() {
            var currentJSON = this.manager.getJSON();
            var colors = this.$container.find(this.config.classes.preview);

            currentJSON.colors = {};

            colors.each($.proxy(function(index, element) {
                var $element = $(element);
                var name = $element.find(this.config.classes.previewName).val();
                var value = $element.find(this.config.classes.previewValue).val();
                var description = $element.find(this.config.classes.previewDescription).val();

                currentJSON.colors[name] = {
                    value: value,
                    description: description
                };
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
                this.loadColors(importJSON);
                this.updateLocalJSON();
            }
        },

        downloadJSON: function() {
            var currentJSON = this.getNewJSON();

            this.manager.downloadJSON(currentJSON);
        }
    });

    $.fn.templatesColors = function(options) {
        return this.each(function() {
            var element = $(this);

            if (element.data('templatesColors')) return;

            var templatesColors = new TemplatesColors(this, options);
            element.data('templatesColors', templatesColors);
        });
    };
})(jQuery);
