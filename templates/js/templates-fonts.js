function updateFonts(json) {
    window.json = json;
    var container = $('.template-fonts-wrapper');
    var template = $('.template-font.is-template');
    var addNewButton = container.find('.btn-add-font');
    var fonts = json.fonts;

    // Reset fonts
    container.find('.template-font').remove();

    // Update fonts from JSON
    for (var index in fonts) {
        var font = fonts[index];
        var name = font.name;
        var type = font.type;
        var weight = font.weight;

        if (type === 'google') {
            loadGoogleFont(font.name, font.weight.join());
        }

        addFontPreview(font, false);
    }
}

function getFonts() {
    $.getJSON('/src/sass/styles.json', function(json) {
        updateFonts(json);
    });
}

function updateFontsDropdown(fonts) {
    var fontDropdowns = $('.template-fonts-add-select');
    fontDropdowns.each(function(index, element) {
        var $element = $(element);
        for (var index in fonts) {
            var font = fonts[index].family;
            var weight = fonts[index].variants.join();
            $element.append('<option value="' + font + '" data-weight="' + weight + '">' + font + '</option>');
        }
    });

    fontDropdowns.on('change', updateFontsWeights).trigger('change');
}

function updateFontsWeights() {
    var fontDropdowns = $('.template-fonts-add-select');
    var selectedOption = fontDropdowns.find('option:selected');
    var selectedWeights = selectedOption.attr('data-weight').split(',');
    var container = $('.template-fonts-add-font-weight');

    // Reset weights
    container.html('');

    for (var index in selectedWeights) {
        var $element = $('.template-fonts-add-font-weight-wrapper.is-template').clone();
        var weight = selectedWeights[index];
        var label = $element.find('label');
        var checkbox = $element.find('input');
        var identifier = 'template-fonts-add-font-weight-' + weight;

        label.attr('for', identifier).find('span').text(weight);
        checkbox.attr('id', identifier).val(weight);
        $element.removeClass('is-template');

        if (weight === 'regular') {
            checkbox.attr('checked', 'checked');
        }

        container.append($element);
    }
}

function loadGoogleFont(family, weight) {
    WebFont.load({
        google: {
            families: [family + ':' + weight]
        }
    });
}

function toggleAddFontSection(section) {
    $('.btn-show-add-font').show().filter('.is-' + section).hide();
    $('.template-fonts-add-input-wrapper').hide().filter('.is-' + section).show();
}

function addNewFont(type) {
    var font = {};
    font.name = $('.template-fonts-add-input-wrapper:visible').find('.template-fonts-add-element').val();
    font.type = type;
    font.weight = [];

    if (type === 'google') {
        var weights = $('.template-fonts-add-font-checkbox:checked');
        weights.each(function(index, element) {
            font.weight.push($(element).val());
        });

        loadGoogleFont(font.name, font.weight.join());
    } else {
        font.weight = ['400'];
    }

    if (font.name !== '') {
        addFontPreview(font, true);
    }
}

function importFontsJSON() {
    var jsonString = $('.json-preview').val();
    if (jsonString !== '') updateFonts(JSON.parse(jsonString));
}

function removeFontPreview() {
    var $element = $(event.currentTarget);

    $element.parents('.template-font').remove();
}

function addFontPreview(font, showDeleteButton) {
    var container = $('.template-fonts-wrapper');
    var $element = $('.template-font.is-template').clone().removeClass('is-template');
    var preview = $element.find('.template-font-preview');

    for (var index in font.weight) {
        var weight = font.weight[index];
        var fontWeight = 'normal';
        var fontStyle = 'normal';

        if (/^\d+$/.test(weight) || weight === 'regular') {
            fontWeight = weight;
        } else if (/^\D+$/.test(weight)) {
            fontStyle = weight;
        } else {
            var matches = weight.match(/(\d+)(\w+)/);
            fontWeight = matches[1];
            fontStyle = matches[2];
        }

        preview.append('<p class="template-font-preview-' + fontWeight + '" style="font-weight: ' + fontWeight + '; font-family: ' + font.name + '; font-style: ' + fontStyle + ';" data-font-weight="' + weight + '">Libéo et les magiciens grincheux font un mélange toxique pour le mal de la Reine et Jack.</p>')
    }

    $element.find('.template-font-name').text(font.name);
    $element.find('.template-font-type').text(font.type);

    if (!showDeleteButton) $element.find('.btn-remove-font').remove();

    container.append($element);
}

function getFontsJSON() {
    var json = window.json;
    var fonts = $('.template-fonts-wrapper .template-font');

    // Reset JSON fonts
    json.fonts = [];

    // Set new JSON fonts
    fonts.each(function(index, element) {
        var $element = $(element);
        var $weightsElements = $element.find('.template-font-preview p');
        var font = {};
        font.name = $element.find('.template-font-name').text();
        font.type = $element.find('.template-font-type').text();
        font.weight = [];

        $weightsElements.each(function(index, element) {
            var $element = $(element);
            font.weight.push($element.attr('data-font-weight'));
        });

        json.fonts.push(font);
    });

    window.json = json;
    return json;
}

function generateFontsJSON() {
    var json = getFontsJSON();
    var preview = $('.json-preview');

    preview.val(JSON.stringify(json, null, 2));
}

function downloadFontsJSON() {
    var url = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(getFontsJSON(), null, 2));
    var link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'styles.json');
    document.body.appendChild(link);
    setTimeout(function() {
        link.click();
        document.body.removeChild(link);
    }, 100);
}

function openGoogleFont() {
    var selectedFont = $('.template-fonts-add-select').val();
    window.open('https://www.google.com/fonts/specimen/' + selectedFont, '_blank');
}
