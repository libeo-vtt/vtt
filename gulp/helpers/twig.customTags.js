var config = require('../config.js');
var lorem = require('lorem-ipsum');
var marked = require('marked');
var customTags = [];

/**
 * Stylesheet
 * Parameters:
 *     [0]: href
 * Usage:
 *     {% stylesheet "path/to/file.css" %}
 */
customTags.push({
    name: 'stylesheet',
    regex: /^stylesheet\s+(.+)$/,
    output: function(args) {
        return '<link rel="stylesheet" href="' + args[0] + '" type="text/css" media="screen">';
    }
});

/**
 * Script
 * Parameters:
 *     [0]: href
 * Usage:
 *     {% script "path/to/file.js" %}
 */
customTags.push({
    name: 'script',
    regex: /^script\s+(.+)$/,
    output: function(args) {
        return '<script type="text/javascript" src="' + args[0] + '"></script>';
    }
});

/**
 * SVG with png fallback
 * Parameters:
 *     [0]: SVG name
 *     [1]: SVG size (optional)
 *     [2]: SVG alternative text (optional)
 * Usage:
 *     {% svg "sheep1" %}
 *     {% svg "sheep1", "100x100" %}
 *     {% svg "sheep1", "100x100", "Sheep" %}
 */
customTags.push({
    name: 'svg',
    regex: /^svg\s+(.+)$/,
    output: function(args) {
        var icon = args[0],
            size = (args[1] !== undefined ? args[1] : config.defaults.svg.width + 'x' + config.defaults.svg.height),
            width = parseInt(size.substring(0, size.indexOf('x'))),
            height = parseInt(size.substring(size.indexOf('x') + 1)),
            alt = (args[2] !== undefined ? args[2] : ''),
            output = '<span class="icon-wrapper ' + config.defaults.svg.prefix + '' + icon + '-wrapper">' +
            '<svg width="' + width + '" height="' + height + '" class="' + config.defaults.svg.prefix + icon + '"><use xlink:href="/svg/symbols.svg#' + icon + '"></use></svg>' +
            (config.svgFallback ? '<img class="svg-fallback ' + config.defaults.svg.prefix + icon + ' ' + config.defaults.svg.prefix + icon + '-fallback" src="img/svg-fallbacks/' + icon + '.png" width="' + width + '" height="' + height + '" alt="' + alt + '" />' : '') +
            '</span>';
        return output;
    }
});

/**
 * Youtube video
 * Parameters:
 *     [0]: Youtube video ID
 * Usage:
 *     {% youtube "XXXXXXXXXXX" %}
 */
customTags.push({
    name: 'youtube',
    regex: /^youtube\s+(.+)$/,
    output: function(args) {
        var id = args[0],
            output = '<div class="iframe-wrapper"><iframe width="100%" height="100%" src="//www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe></div>';
        return output;
    }
});

/**
 * Vimeo video
 * Parameters:
 *     [0]: Vimeo video ID
 * Usage:
 *     {% vimeo "XXXXXXXXX" %}
 */
customTags.push({
    name: 'vimeo',
    regex: /^vimeo\s+(.+)$/,
    output: function(args) {
        var id = args[0],
            output = '<div class="iframe-wrapper"><iframe src="//player.vimeo.com/video/' + id + '?title=0&amp;portrait=0&amp;badge=0" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
        return output;
    }
});

/**
 * Placeholder image with placehold.it
 * Parameters:
 *     [0]: Image size
 *     [1]: Image label (optional)
 * Usage:
 *     {% placeholder "100x100" %}
 *     {% placeholder "100x100", "Image" %}
 */
customTags.push({
    name: 'placeholder',
    regex: /^placeholder\s+(.+)$/,
    output: function(args) {
        var size = args[0],
            text = (args[1] !== undefined ? args[1] : '');
        output = '<img src="http://placehold.it/' + size + '&text=' + text + '" alt="' + text + '" />';
        return output;
    }
});

/**
 * Lorem ipsum generator
 * Parameters:
 *     [0]: Word count
 * Usage:
 *     {% lorem 100 %}
 */
customTags.push({
    name: 'lorem',
    regex: /^lorem\s+(.+)$/,
    output: function(args) {
        var min = args[0] * config.defaults.loremipsum.minRange,
            max = args[0] * config.defaults.loremipsum.maxRange,
            output = lorem({
                count: Math.random() * (max - min) + min,
                units: 'words'
            });
        return output.charAt(0).toUpperCase() + output.slice(1) + '.';
    }
});

/**
 * Google Analytics tracking code
 * Parameters:
 *     [0]: Tracking code
 * Usage:
 *     {% google-analytics "XX-XXXXXXXX-X" %}
 */
customTags.push({
    name: 'google-analytics',
    regex: /^google-analytics\s+(.+)$/,
    output: function(args) {
        var output = '<script>' +
            '(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,"script","//www.google-analytics.com/analytics.js","ga");' +
            'ga("create", "' + args[0] + '", "auto");' +
            'ga("send", "pageview");' +
            '</script>';
        return output;
    }
});

/**
 * Google Map
 * Parameters:
 *     [0]: Location
 * Usage:
 *     {% map "Lebourgneuf, Québec, Canada" %}
 */
customTags.push({
    name: 'map',
    regex: /^map\s+(.+)$/,
    output: function(args) {
        var locked = (args[1] === 'locked' ? ' is-locked' : ''),
            output = '<div class="iframe-wrapper map-wrapper' + locked + '"><iframe width="100%" height="100%" frameborder="0" src="https://www.google.com/maps/embed/v1/place?q=' + args[0] + '&key=' + config.defaults.googleMap.apiKey + '"></iframe></div>';

        // Prevent map display without API
        if (config.defaults.googleMap.apiKey === 'XXXXXXXXXXXXXXXXXXXXXXXXXXX-XX-XXXXXXXX') {
            output = '<p>You must change the default API key in <code>/gulp/config.js</code></p>';
        }

        return output;
    }
});

/**
 * Breadcrumb
 * Parameters:
 *     [0-...]: Page title to display
 * Usage:
 *     {% breadcrumb "page1", "page2", "page3" %}
 */
customTags.push({
    name: 'breadcrumb',
    regex: /^breadcrumb\s+(.+)$/,
    output: function(args) {
        var output = '<nav class="breadcrumb"><ul class="breadcrumb-wrapper">';
        args.forEach(function(value) {
            output += '<li class="breadcrumb-element"><a href="#">' + value + '</a></li>';
        });
        output += '</ul></nav>';
        return output;
    }
});

/**
 * Pagination
 * Parameters:
 *     [0-...]: Page label to display
 * Shortcode:
 *     0..0: Range of pages to display
 * Usage:
 *     {% pagination "Previous", "1", "2", "3", "Next" %}
 *     {% pagination "Previous", "1..10", "Next" %}
 */
customTags.push({
    name: 'pagination',
    regex: /^pagination\s+(.+)$/,
    output: function(args) {
        var output = '<nav class="pagination"><ul class="pagination-wrapper">';
        args.forEach(function(value) {
            if (/^([0-9]){1,}.{2}([0-9]){1,}/g.test(value)) {
                var min = parseInt(value.substring(0, value.indexOf('.'))),
                    max = parseInt(value.substring(value.indexOf('.') + 2));
                for (var i = min; i <= max; i++) {
                    output += '<li class="pagination-element"><a href="#">' + i + '</a></li>';
                }
            } else {
                output += '<li class="pagination-element"><a href="#">' + value + '</a></li>';
            }
        });
        output += '</ul></nav>';
        return output;
    }
});

/**
 * Markdown
 */
customTags.push({
    name: 'markdown',
    regex: /^markdown\s+(.+)$/,
    next: ['endmarkdown'],
    output: function(args) {
        var output = marked(args[0]);
        return output;
    }
});

module.exports = customTags;
