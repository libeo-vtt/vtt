var sizeOf = require('image-size');
var sass = require('node-sass');
var project = require('../../package.json');
var config = require('../config.js');

var customFunctions = {
    'image-width($url: "")': function(url) {
        var image = url.getValue();
        var dimensions = sizeOf(config.src + 'img/' + image);
        return sass.types.String(dimensions.width.toString() + 'px');
    },
    'image-height($url: "")': function(url) {
        var image = url.getValue();
        var dimensions = sizeOf(config.src + 'img/' + image);
        return sass.types.String(dimensions.height.toString() + 'px');
    }
}

module.exports = customFunctions;
