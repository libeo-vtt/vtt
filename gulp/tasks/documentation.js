var gulp = require('gulp');
var twig = require('gulp-twig');
var argv = require('yargs').argv;
var prettify = require('gulp-prettify');
var marked = require('marked');
var runSequence = require('run-sequence');
var config = require('../config.js');
var extendTwig = require('../helpers/twig.exports.extendTag.js');
var customFunctions = require('../helpers/twig.customFunctions.js');
var customTags = require('../helpers/twig.customTags.js');

function slugify(string) {
    return string.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

function stripAccents(string) {
    string = string.split('');
    var outputString = [];
    var stringLen = string.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
    for (var y = 0; y < stringLen; y++) {
        if (accents.indexOf(string[y]) !== -1) {
            outputString[y] = accentsOut.substr(accents.indexOf(string[y]), 1);
        } else
            outputString[y] = string[y];
    }
    outputString = outputString.join('');
    return outputString;
}

gulp.task('documentation', ['sass-documentation'], function() {
    return gulp.src(['./documentation/index.twig'], {
            base: 'documentation/'
        })
        .pipe(twig({
            functions: customFunctions,
            extend: function(Twig) {
                return extendTwig(Twig, customTags);
            },
            filters: [{
                name: 'markdown',
                func: function(content) {
                    return marked(content);
                }
            }, {
                name: 'slugify',
                func: function(content) {
                    return slugify(stripAccents(content));
                }
            }],
            onError: function(event) {}
        }))
        .pipe(prettify(config.prettify))
        .pipe(gulp.dest(config.build + 'documentation/'));
});
