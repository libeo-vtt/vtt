var gulp = require('gulp');
var argv = require('yargs').argv;
var twig = require('gulp-twig');
var prettify = require('gulp-prettify');
var runSequence = require('run-sequence');
var extendTwig = require('../helpers/twig.exports.extendTag.js');
var customFunctions = require('../helpers/twig.customFunctions.js');
var customTags = require('../helpers/twig.customTags.js');

var config = require('../config.js');

gulp.task('twig', (argv.prod ? [] : ['twig:templates']), function() {
    return gulp.src([config.src + 'twig/views/**/*.twig'], {
            base: 'src/twig/views/'
        })
        .pipe(twig({
            data: config.defaults.twig.data ? require('../../' + config.src + config.defaults.twig.file) : {},
            functions: customFunctions,
            extend: function(Twig) {
                return extendTwig(Twig, customTags);
            },
            onError: function(event) {}
        }))
        .pipe(prettify(config.prettify))
        .pipe(gulp.dest(config.build));
});

gulp.task('twig:templates', function() {
    return gulp.src([config.templates + 'twig/*.twig'], {
            base: 'templates/twig/'
        })
        .pipe(twig({
            data: config.defaults.twig.data ? require('../../' + config.src + config.defaults.twig.file) : {},
            functions: customFunctions,
            extend: function(Twig) {
                return extendTwig(Twig, customTags);
            },
            onError: function(event) {}
        }))
        .pipe(prettify(config.prettify))
        .pipe(gulp.dest(config.build + 'templates/'));
});
