var package = require('../../package.json');
var project = require('../../project.json');
var styles = require('../../src/sass/styles.json');
var glob = require('glob');
var argv = require('yargs').argv;
var config = require('../config.js');

var customFunctions = [];

/**
 * get_config
 * Return:
 *     Project informations from project.json
 */
customFunctions.push({
    name: 'get_config',
    func: function(args) {
        return config;
    }
});

/**
 * get_project_informations
 * Return:
 *     Project informations from project.json
 */
customFunctions.push({
    name: 'get_project_informations',
    func: function(args) {
        return project;
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
        return package.version;
    }
});

/**
 * get_project_name
 * Return:
 *     Project name from project.json
 */
customFunctions.push({
    name: 'get_project_name',
    func: function(args) {
        return project.name;
    }
});

/**
 * get_project_displayedName
 * Return:
 *     Project displayedName from project.json
 */
customFunctions.push({
    name: 'get_project_displayedName',
    func: function(args) {
        return project.displayedName;
    }
});

/**
 * get_project_description
 * Return:
 *     Project description from project.json
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
 *     Project keywords from project.json
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
 *     Project url from project.json
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
 *     Project repository from project.json
 */
customFunctions.push({
    name: 'get_project_repository',
    func: function(args) {
        return project.repository;
    }
});

/**
 * get_project_browsers
 * Return:
 *     Project browsers from project.json
 */
customFunctions.push({
    name: 'get_project_browsers',
    func: function(args) {
        return project.browsers;
    }
});

/**
 * get_project_responsive
 * Return:
 *     Project responsive from project.json
 */
customFunctions.push({
    name: 'get_project_responsive',
    func: function(args) {
        return (project.responsive ? 'Oui' : 'Non');
    }
});

/**
 * get_project_accessible
 * Return:
 *     Project accessible from project.json
 */
customFunctions.push({
    name: 'get_project_accessible',
    func: function(args) {
        return (project.accessible ? 'Oui' : 'Non');
    }
});

/**
 * get_project_retina
 * Return:
 *     Project retina from project.json
 */
customFunctions.push({
    name: 'get_project_retina',
    func: function(args) {
        return (project.retina ? 'Oui' : 'Non');
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
            var webfont = font.name + ':' + font.variants.join();
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
            var webfont = (index > 0 ? '%7C' : '') + font.name.replace(' ', '+') + ':' + font.variants.join();
            url += webfont;
        }
        return url;
    }
});

/**
 * get_svg_collection
 * Return:
 *     Array of SVG files
 */
customFunctions.push({
    name: 'get_svg_collection',
    func: function(collectionName) {
        var files = [];
        var baseDirectory = config.src + 'svg/';
        if (collectionName === 'all') {
            var filesPath = baseDirectory + '**/*.svg';
        } else if (collectionName === 'generic' || collectionName === 'global') {
            var filesPath = baseDirectory + '*.svg';
        } else {
            var filesPath = baseDirectory + collectionName + '**/*.svg';
        }
        glob.sync(filesPath).forEach(function(file) {
            var fileObject = {};
            fileObject.url = file.replace(baseDirectory, '');
            fileObject.name = fileObject.url.replace(collectionName + '/', '');
            files.push(fileObject);
        });
        return files;
    }
});

/**
 * get_static_pages
 * Return:
 *     HTML list with static pages links
 */
customFunctions.push({
    name: 'get_static_pages',
    func: function(args) {
        var files = [];
        var baseDirectory = config.src + 'twig/views/';
        var filesPath = baseDirectory + '**/*.twig';
        glob.sync(filesPath).forEach(function(file) {
            var fileName = file.replace(baseDirectory, '').replace('.twig', '.html');
            files.push(fileName);
        });
        return files;
    }
});

/**
 * create_debug_static_nav
 * Return:
 *     HTML list with static pages links
 */
customFunctions.push({
    name: 'create_debug_static_nav',
    func: function(args) {
        if (!argv.prod) {
            var index = 0;
            var output = '<nav class="debug_static_nav" style="position: fixed; bottom: 0; left: 0; width: 100%; padding: 10px 20px; background-color: rgba(0,0,0,0.75); text-align: center;"><ul>';
            var files = glob.sync(config.src + 'twig/views/**/*.twig');
            files.forEach(function(file) {
                var filename = file.replace(config.src + 'twig/views/', '').replace('.twig', '');
                output += '<li style="display: inline-block; vertical-align: middle; ' + (index > 0 ? 'margin-left: 15px;' : '') + '"><a href="/' + filename + '.html" style="color: #fff; text-transform: uppercase; font-size: 12px; text-decoration: none;">' + filename + '</a></li>';
                index++;
            });
            output += '</ul></nav>';
            return output;
        } else {
            return '';
        }
    }
});

module.exports = customFunctions;
