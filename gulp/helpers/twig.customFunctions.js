var project = require('../../package.json');
var config = require('../config.js');
var glob = require('glob');
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
 * ceil
 * Return:
 *     Math.ceil(value)
 */
customFunctions.push({
    name: 'create_static_nav',
    func: function(args) {
        var output = '<nav class="debug_static_nav"><ul>';
        var files = glob.sync(config.src + 'twig/views/**/*.twig');
        files.forEach(function(file) {
            var filename = file.replace(config.src + 'twig/views/', '').replace('.twig', '');
            output += '<li><a href="/' + filename + '.html">' + filename + '</a></li>';
        });
        output += '</ul></nav>';
        return output;
    }
});

module.exports = customFunctions;
