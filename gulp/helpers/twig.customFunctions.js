var project = require('../../package.json');
var styles = require('../../src/sass/styles.json');
var config = require('../config.js');

var customFunctions = [];

/**
 * get_project_name
 * Return:
 *     Project name from package.json
 */
customFunctions.push({
    name: 'get_project_name',
    func: function(args) {
        return project.name;
    }
});

/**
 * get_project_version
 * Return:
 *     Project version from package.json
 */
customFunctions.push({
    name: 'get_project_version',
    func: function(args) {
        return project.version;
    }
});

/**
 * get_project_description
 * Return:
 *     Project description from package.json
 */
customFunctions.push({
    name: 'get_project_description',
    func: function(args) {
        return project.description;
    }
});

/**
 * get_project_keywords
 * Return:
 *     Project keywords from package.json
 */
customFunctions.push({
    name: 'get_project_keywords',
    func: function(args) {
        return project.keywords;
    }
});

/**
 * get_project_url
 * Return:
 *     Project url from package.json
 */
customFunctions.push({
    name: 'get_project_url',
    func: function(args) {
        return project.url;
    }
});

/**
 * get_project_repository
 * Return:
 *     Project repository from package.json
 */
customFunctions.push({
    name: 'get_project_repository',
    func: function(args) {
        return project.repository;
    }
});

/**
 * get_styles_json
 * Return:
 *     JSON from styles.json
 */
customFunctions.push({
    name: 'get_styles_json',
    func: function(args) {
        return styles;
    }
});

/**
 * get_webfonts
 * Return:
 *     Webfonts array from styles.json
 */
customFunctions.push({
    name: 'get_webfonts',
    func: function(args) {
        var fonts = styles.fonts;
        var webfonts = [];
        for (var index in fonts) {
            var font = fonts[index];
            var webfont = font.name + ':' + font.variances.join();
            webfonts.push(webfont);
        }
        return webfonts;
    }
});

/**
 * get_webfonts_url
 * Return:
 *     Webfonts array from styles.json
 */
customFunctions.push({
    name: 'get_webfonts_url',
    func: function(args) {
        var fonts = styles.fonts;
        var url = 'http://fonts.googleapis.com/css?family=';
        for (var index in fonts) {
            var font = fonts[index];
            var webfont = (index > 0 ? '%7C' : '') + font.name.replace(' ', '+') + ':' + font.variances.join();
            url += webfont;
        }
        return url;
    }
});

/**
 * ceil
 * Return:
 *     Math.ceil(value)
 */
customFunctions.push({
    name: 'ceil',
    func: function(args) {
        return Math.ceil(args);
    }
});

/**
 * floor
 * Return:
 *     Math.floor(value)
 */
customFunctions.push({
    name: 'floor',
    func: function(args) {
        return Math.floor(args);
    }
});

module.exports = customFunctions;
