function updateTypography(json) {
    window.json = json;
    var container = $('.template-typography-edit-panel-wrapper');
    var template = $('.template-typography-edit-panel-inputs.is-template');
    var colors = json.colors;
    var typography = json.typography;

    window.shiftPressed = false;
    window.altPressed = false;

    // Reset typography
    container.html('');

    // Update selectors dropdown
    var selectorsDropdown = $('.template-typography-edit-selector');
    // Reset selectors dropdown
    selectorsDropdown.html('');
    for (var index in typography) {
        var selector = index;
        selectorsDropdown.append('<option value="' + selector + '">' + selector + '</option>');
    }
    selectorsDropdown.trigger('change');

    // Update typography from JSON
    for (var index in typography) {
        var selector = index;
        var properties = typography[index];
        var element = template.clone();

        // Update colors dropdown
        var colorsDropdown = element.find('.template-typography-edit-color');
        for (var index in colors) {
            var name = index;
            var color = colors[index];
            colorsDropdown.append('<option value="' + name + '">' + name + '</option>');
        }

        // Initialize each properties
        for (var index in properties) {
            var property = index;
            var value = properties[index];
            var input = element.find('[data-edit="' + property + '"]');
            input.val(value);
            updateTypographyPreview(selector, input, value);
            if (property === 'font-family') {
                input.attr('data-font-family', value);
            }
        }

        // Append each edit panel
        element.attr('data-selector', selector);
        element.removeClass('is-template');
        container.append(element);

        // Bind preview click event
        $('.template-typography-preview ' + selector).off('click', changeCurrentSelector);
        $('.template-typography-preview ' + selector).on('click', changeCurrentSelector);
    }

    // Activate first edit panel
    container.find('.template-typography-edit-panel-inputs').first().addClass('is-active');
}

function getTypography() {
    $.getJSON('/src/sass/styles.json', function(json) {
        // Bind events
        $(document).on('change', '.template-typography-edit-selector', function(event) {
            var selector = $(event.currentTarget).val();
            $('.template-typography-edit-panel-inputs')
                .removeClass('is-active')
                .filter('[data-selector="' + selector + '"]')
                .addClass('is-active');
            $('.is-editing').removeClass('is-editing');
            $(selector).addClass('is-editing');
        });

        // Bind events
        $(document).on('change', '.template-typography-input', function(event) {
            var selector = $('.template-typography-edit-selector').val();
            var $element = $(event.currentTarget);
            updateTypographyPreview(selector, $element, $element.val());
        });

        // Bind events
        $(document).on('keydown', '.template-typography-input', function(event) {
            var variance = 0;
            var $element = $(event.currentTarget);
            if (event.keyCode === 16) { // Shift
                window.shiftPressed = true;
            }
            if (event.keyCode === 18) { // Alt
                window.altPressed = true;
            }
            if (event.keyCode === 38) { // Up arrow
                variance = 1;
                if (window.shiftPressed) variance = 10;
                if (window.altPressed) variance = 0.1;
                adjustInputValue($element, variance);
            } else if (event.keyCode === 40) { // Down arrow
                variance = -1;
                if (window.shiftPressed) variance = -10;
                if (window.altPressed) variance = -0.1;
                adjustInputValue($element, variance);
            }
        });

        // Bind shift and alt keyup
        $(document).on('keyup', '.template-typography-input', function(event) {
            if (event.keyCode === 16) { // Shift
                window.shiftPressed = false;
            }
            if (event.keyCode === 18) { // Alt
                window.altPressed = false;
            }
        });

        updateFontDropdowns(json.fonts);
        updateTypography(json);
    });
}

function changeCurrentSelector(event) {
    var $element = $(event.currentTarget);
    var selector = $element.prop('tagName').toLowerCase();

    $('.template-typography-edit-selector').val(selector).trigger('change');

    event.stopPropagation();
    event.preventDefault();
}

function importTypographyJSON() {
    var jsonString = $('.json-preview').val();
    var json = JSON.parse(jsonString);
    if (jsonString !== '') updateTypography(json);
    updateFontDropdowns(json.fonts);
}

function updateTypographyPreview(selector, element, value) {
    var property = element.attr('data-edit');

    if (property === 'color') {
        value = window.json.colors[value];
    }

    if (property.substr(0, 6) == 'margin' && value == '') {
        element.val(0);
    }

    $('.template-typography-preview ' + selector).css(property, value);
    $('.template-typography-preview :first-child').not('li > ul').not('li > ol').css('margin-top', '0');
    $('.template-typography-preview :last-child').not('li > ul').not('li > ol').css('margin-bottom', '0');
}

function getTypographyJSON() {
    var json = window.json;
    var panels = $('.template-typography-edit-panel-inputs:not(.is-template)');
    var preview = $('.json-preview');

    // Set new JSON typography
    panels.each(function(index, element) {
        var $element = $(element);
        var selector = $element.attr('data-selector');
        var inputs = $element.find('.template-typography-input');

        inputs.each(function(index, element) {
            var $input = $(element);
            var property = $input.attr('data-edit');
            var value = $input.val();
            json.typography[selector][property] = value;
        });
    });

    window.json = json;
    return json;
}

function generateTypographyJSON() {
    var json = getTypographyJSON();
    var preview = $('.json-preview');

    preview.val(JSON.stringify(json, null, 2));
}

function stickOnScroll() {
    var $panel = $('.template-typography-edit-panel');
    var offset = $panel.offset().top;
    $(window).on('scroll', function() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > offset) {
            $panel.addClass('is-fixed');
        } else {
            $panel.removeClass('is-fixed');
        }
    }).trigger('scroll');
}

function updateFontDropdowns(fonts) {
    var fontDropdowns = $('.template-typography-edit-font-family');
    fontDropdowns.each(function(index, element) {
        var $element = $(element);
        var currentFontFamily = $element.attr('data-font-family');
        for (var index in fonts) {
            var font = fonts[index].name;
            $element.append('<option value="' + font + '" ' + (currentFontFamily === font ? "selected" : "") + '>' + font + '</option>');
        }
    });
}

function adjustInputValue($element, variance) {
    var initialValue = $element.val();
    var matches = initialValue.match(/(.*\d+)(.+)/);
    var value = parseFloat((matches !== null ? matches[1] : 0));
    var unit = (matches !== null ? matches[2] : 'px');
    var newValue = (value * 1000 + variance * 1000) / 1000;

    $element.val(newValue + unit);

    // Update preview
    $element.trigger('change');
}

function downloadTypographyJSON() {
    var url = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(getTypographyJSON(), null, 2));
    var link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'styles.json');
    document.body.appendChild(link);
    setTimeout(function() {
        link.click();
        document.body.removeChild(link);
    }, 100);
}
