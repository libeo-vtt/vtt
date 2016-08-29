(function($) {
    var TemplatesBreakpoints = function(element, options) {
        this.templatesBreakpoints = $(element);
        this.manager = new TemplatesManager();

        // Default module configuration
        this.defaults = {
            classes: {
                container: '.template-breakpoints-wrapper',
                grid: '.template-breakpoints-grid',
                template: '.template-breakpoint.is-template',
                addButton: '.btn-add-breakpoint',
                preview: '.template-breakpoint',
                previewGridElement: '.template-breakpoint-grid-element',
                previewName: '.template-breakpoint-name',
                previewMin: '.template-breakpoint-min',
                previewMinActivate: '.template-breakpoint-min-activate',
                previewMax: '.template-breakpoint-max',
                previewMaxActivate: '.template-breakpoint-max-activate',
                previewAdjustableInput: '.template-breakpoint-adjustable',
                previewDeleteButton: '.btn-remove-breakpoint'
            }
        };

        // Merge default classes with window.project.classes
        this.classes = $.extend(true, this.defaults.classes, window.project.classes || {});

        // Merge default config with custom config
        this.config = $.extend(true, this.defaults, options || {});

        this.$container = $(this.classes.container);
        this.$template = $(this.classes.template);
        this.$grid = $(this.classes.grid);
        this.$addButton = $(this.classes.addButton);

        this.biggestBreakpoint;

        this.init();
    };

    $.extend(TemplatesBreakpoints.prototype, {

        init: function() {
            this.bindEvents();
            this.loadJSON();
        },

        bindEvents: function() {
            this.$addButton.on('click', $.proxy(function() {
                this.createBreakpointPreview({
                    name: 'Custom',
                    min: '480px',
                    max: '1600px'
                }, true);
            }, this));

            $(document).on('change', this.classes.previewMinActivate, $.proxy(function(event) {
                var $input = $(event.currentTarget).next(this.classes.previewMin);
                if ($input.attr('disabled')) {
                    $input.removeAttr('disabled');
                } else {
                    $input.val('');
                    $input.attr('disabled', 'disabled');
                }
                this.updateBreakpointPositions();
            }, this));

            $(document).on('change', this.classes.previewMaxActivate, $.proxy(function(event) {
                var $input = $(event.currentTarget).next(this.classes.previewMax);
                if ($input.attr('disabled')) {
                    $input.removeAttr('disabled');
                } else {
                    $input.val('');
                    $input.attr('disabled', 'disabled');
                }
                this.updateBreakpointPositions();
            }, this));

            $(document).on('keydown', this.classes.previewAdjustableInput, $.proxy(function(event) {
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

            $(document).on('mousewheel', this.classes.previewAdjustableInput + '[type="text"]', $.proxy(function(event) {
                var variance = (event.originalEvent.wheelDelta > 0 ? 1 : -1);
                var $element = $(event.currentTarget);

                if (!$element.is(':disabled')) this.adjustInputValue($element, variance);
                event.preventDefault();
            }, this));

            $(document).on('keyup', this.classes.previewAdjustableInput, $.proxy(function(event) {
                if (event.keyCode === 16) this.isShiftPressed = false;
                if (event.keyCode === 18) this.isAltPressed = false;
            }, this));

            this.manager.$generateButton.on('click', $.proxy(this.generateJSON, this));
            this.manager.$importButton.on('click', $.proxy(this.importJSON, this));
            this.manager.$downloadButton.on('click', $.proxy(this.downloadJSON, this));
        },

        loadJSON: function() {
            this.manager.getJSON($.proxy(this.loadBreakpoints, this));
        },

        loadBreakpoints: function(data) {
            this.$container.find(this.classes.preview).remove();
            this.updateMaxBreakpoint();

            for (var index in data.breakpoints) {
                this.createBreakpointPreview(data.breakpoints[index], false);
            }

            this.updateGrid();
            this.manager.finishLoading();
        },

        createBreakpointPreview: function(breakpoint, editable) {
            var $element = this.$template.clone().removeClass('is-template');
            var $previewName = $element.find(this.classes.previewName);
            var $previewMin = $element.find(this.classes.previewMin);
            var $previewMinActivate = $element.find(this.classes.previewMinActivate);
            var $previewMax = $element.find(this.classes.previewMax);
            var $previewMaxActivate = $element.find(this.classes.previewMaxActivate);
            var $deleteButton = $element.find(this.classes.previewDeleteButton);

            $previewName.val(breakpoint.name);

            if (breakpoint.min === 'null') {
                $previewMin.attr('disabled', 'disabled');
            } else {
                $previewMin.val(breakpoint.min);
                $previewMinActivate.attr('checked', 'checked');
            }

            if (breakpoint.max === 'null') {
                $previewMax.attr('disabled', 'disabled');
            } else {
                $previewMax.val(breakpoint.max);
                $previewMaxActivate.attr('checked', 'checked');
            }

            if (!editable) {
                $deleteButton.hide();
                $element.find(this.classes.previewName).attr('readonly', 'true');
            } else {
                $element.addClass('is-new');
                $deleteButton.on('click', $.proxy(function(event) {
                    this.deleteBreakpointPreview($element);
                }, this));
            }

            $previewMin.add($previewMax).on('change', $.proxy(function(event) {
                this.updateBreakpointPositions();
                this.updateGrid();
            }, this));

            $previewName.add($previewMin).add($previewMax).on('change', $.proxy(function(event) {
                this.updateLocalJSON();
            }, this));

            this.setBreakpointPosition($element, breakpoint);
            this.$container.append($element);
        },

        setBreakpointPosition: function($element, breakpoint) {
            var min = 0;
            var max = parseInt(this.biggestBreakpoint.max);
            var bpMin = parseInt(breakpoint.min);
            var bpMax = parseInt(breakpoint.max);
            var $previews = this.$container.find(this.classes.preview);
            var height = $previews.length > 0 ? $previews.eq(0).outerHeight() : 'auto';

            if (max < 1920) max = 1920;
            if (breakpoint.min === 'null') bpMin = 0;
            if (breakpoint.max === 'null') bpMax = max;

            var left = (bpMin - min) / max * 100;
            var width = (bpMax - bpMin) / max * 100;
            var top = $previews.length * height;

            $element.css({
                left: left + '%',
                width: width + '%',
                top: top + 'px'
            });

            this.$container.css('height', ($previews.length + 1) * height);
        },

        updateBreakpointPositions: function() {
            this.updateMaxBreakpoint();
            var min = 0;
            var max = parseInt(this.biggestBreakpoint.max);
            var $previews = this.$container.find(this.classes.preview);
            var height = $previews.eq(0).outerHeight(true);

            $previews.each($.proxy(function(index, element) {
                var $element = $(element);
                var bpMin = parseInt($element.find(this.classes.previewMin).val());
                var bpMax = parseInt($element.find(this.classes.previewMax).val());

                if (max < 1920) max = 1920;
                if (isNaN(bpMin)) bpMin = 0;
                if (isNaN(bpMax)) bpMax = max;

                var left = (bpMin - min) / max * 100;
                var width = (bpMax - bpMin) / max * 100;
                var top = index * height;

                $element.css({
                    left: left + '%',
                    width: width + '%',
                    top: top + 'px'
                });
            }, this));

            this.$container.css('height', ($previews.length) * height);
            this.updateLocalJSON();
        },

        updateBreakpointPreview: function($preview, breakpoint) {
            $preview.find(this.classes.previewName).val(breakpoint.name);
            $preview.find(this.classes.previewMin).val(breakpoint.min);
            $preview.find(this.classes.previewMax).val(breakpoint.max);

            this.updateLocalJSON();
            this.updateMaxBreakpoint();
        },

        deleteBreakpointPreview: function($preview) {
            $preview.remove();
            this.updateBreakpointPositions();
            this.updateLocalJSON();
        },

        updateGrid: function() {
            var min = 0;
            var max = parseInt(this.biggestBreakpoint.max);

            if (max < 1920) max = 1920;

            this.$grid.find(this.classes.previewGridElement).remove();

            for (var i = 0; i < max / 100; i++) {
                var $element = $('<div class="' + this.classes.previewGridElement.replace('.', '') + '"></div>');
                $element.css('left', i * 100 / max * 100 + '%');
                $element.attr('data-label', i * 100);
                this.$grid.append($element);
            }
        },

        adjustInputValue: function($element, variance) {
            if (this.isShiftPressed) variance = variance * 10;
            if (this.isAltPressed) variance = variance * 0.10;

            var initialValue = $element.val();
            var matches = initialValue.match(/(.*\d+)(.+)/);
            var value = parseFloat((matches !== null ? matches[1] : 0));
            var unit = (matches !== null ? matches[2] : 'px');
            var newValue = (value * 1000 + variance * 1000) / 1000;

            if (newValue <= 0) {
                newValue = 0;
                unit = '';
            }

            $element.val(newValue + unit);
            $element.trigger('change');
        },

        updateMaxBreakpoint: function() {
            var currentJSON = this.biggestBreakpoint === undefined ? this.manager.getJSON() : this.getNewJSON();
            this.biggestBreakpoint = currentJSON.breakpoints[0];

            for (var index in currentJSON.breakpoints) {
                var currentBreakpoint = currentJSON.breakpoints[index];
                if (parseInt(currentBreakpoint.max) > parseInt(this.biggestBreakpoint.max)) {
                    this.biggestBreakpoint = currentBreakpoint;
                }
            }
        },

        getNewJSON: function() {
            var currentJSON = this.manager.getJSON();
            var breakpoints = this.$container.find(this.classes.preview);

            currentJSON.breakpoints = [];

            breakpoints.each($.proxy(function(index, element) {
                var $element = $(element);
                var name = $element.find(this.classes.previewName).val();
                var min = $element.find(this.classes.previewMin).val();
                var max = $element.find(this.classes.previewMax).val();

                if (min === '') min = 'null';
                if (max === '') max = 'null';

                currentJSON.breakpoints.push({
                    name: name,
                    min: min,
                    max: max
                });
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
                this.loadBreakpoints(importJSON);
                this.updateLocalJSON();
            }
        },

        downloadJSON: function() {
            var currentJSON = this.getNewJSON();

            this.manager.downloadJSON(currentJSON);
        }
    });

    $.fn.templatesBreakpoints = function(options) {
        return this.each(function() {
            var element = $(this);

            if (element.data('templatesBreakpoints')) return;

            var templatesBreakpoints = new TemplatesBreakpoints(this, options);
            element.data('templatesBreakpoints', templatesBreakpoints);
        });
    };
})(jQuery);
