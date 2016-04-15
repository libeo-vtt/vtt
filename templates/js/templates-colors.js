function updateColors(json) {
    // window.json = json;
    // var container = $('.template-colors-wrapper');
    // var template = $('.template-color.is-template');
    // var addNewButton = container.find('.btn-add-color');
    // var colors = json.colors;

    // // Reset colors
    // container.find('.template-color').remove();

    // // Update colors from JSON
    // for (var index in colors) {
    //     var name = index;
    //     var color = colors[index];
    //     var element = template.clone();
    //     element.find('.template-color-preview').css('background-color', color.value);
    //     element.find('.template-color-name').val(name).attr('readonly', 'true');
    //     element.find('.template-color-value').val(color.value);
    //     element.find('.template-color-description').val(color.description);
    //     element.find('.btn-remove-color').css('visibility', 'hidden');
    //     element.removeClass('is-template');
    //     addNewButton.before(element);
    // }

    // // Bind events
    // $(document).on('change', '.template-color-value', updateColorPreview);
    // $(document).on('click', '.btn-remove-color', removeColorPreview);
}

function getColors() {
    $.getJSON('/src/sass/styles.json', function(json) {
        var localJSON = JSON.parse(localStorage.getItem('JSON'));

        if (localJSON !== null && localJSON.lastUpdated > json.lastUpdated) {
            json = localJSON;
        }

        updateColors(json);
    });
}

function resetColorsJSON() {
    localStorage.removeItem('JSON');
    getColors();
}

function importColorsJSON() {
    var jsonString = $('.json-preview').val();
    if (jsonString !== '') updateColors(JSON.parse(jsonString));
}

function updateColorPreview(event) {
    var element = $(event.currentTarget);
    var color = element.val();

    element.parents('.template-color').find('.template-color-preview').css('background-color', color);
}

function removeColorPreview() {
    var element = $(event.currentTarget);

    element.parents('.template-color').remove();
}

function addColorPreview() {
    var container = $('.template-colors-wrapper');
    var addNewButton = container.find('.btn-add-color');
    var template = $('.template-color.is-template').clone().removeClass('is-template');

    addNewButton.before(template);
}

function getColorsJSON() {
    var json = window.json;
    var colors = $('.template-colors-wrapper .template-color');

    // Reset JSON colors
    json.colors = {};

    // Set new JSON colors
    colors.each(function(index, element) {
        var $element = $(element);
        var name = $element.find('.template-color-name').val();
        var value = $element.find('.template-color-value').val();
        var description = $element.find('.template-color-description').val();
        json.colors[name] = {
            value: value,
            description: description
        };
    });

    json.lastUpdated = new Date().getTime();

    window.json = json;
    return json;
}

function generateColorsJSON() {
    var json = getColorsJSON();
    var preview = $('.json-preview');
    var strJSON = JSON.stringify(json, null, 2);

    preview.val(strJSON);

    // Save JSON in localStorage
    localStorage.setItem('JSON', strJSON);
}

function updateLocalStorage() {
    var json = getColorsJSON();
    var strJSON = JSON.stringify(json, null, 2);
    localStorage.setItem('JSON', strJSON);
}

function downloadColorsJSON() {
    var url = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(getColorsJSON(), null, 2));
    var link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'styles.json');
    document.body.appendChild(link);
    setTimeout(function() {
        link.click();
        document.body.removeChild(link);
    }, 100);
}
