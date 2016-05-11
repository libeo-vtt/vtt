var sizeOf = require('image-size');
var sass = require('node-sass');
var project = require('../../package.json');
var config = require('../config.js');
var styles = require('../../src/sass/styles.json');

var customFunctions = {
    'get-main-font()': function() {
        var returnValue = '';
        var matches = styles.fonts.filter(function(font) {
            return font.main === true;
        });
        var returnValue = (matches.length > 0 ? matches[0].name : config.defaults.sass.mainFont);
        return sass.types.String(returnValue);
    },
    'image-width($url: "")': function(url) {
        var image = url.getValue();
        var dimensions = sizeOf(config.src + 'img/' + image);
        return sass.types.Number(dimensions.width, 'px');
    },
    'image-height($url: "")': function(url) {
        var image = url.getValue();
        var dimensions = sizeOf(config.src + 'img/' + image);
        return sass.types.Number(dimensions.height, 'px');
    }
}

module.exports = customFunctions;
