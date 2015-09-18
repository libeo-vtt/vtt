var gulp = require('gulp');
var twig = require('gulp-twig');
var argv = require('yargs').argv;
var prettify = require('gulp-prettify');
var runSequence = require('run-sequence');
var config = require('../config.js');
var extendTwig = require('../helpers/twig.exports.extendTag.js');
var customFunctions = require('../helpers/twig.customFunctions.js');
var customTags = require('../helpers/twig.customTags.js');

gulp.task('twig', (argv.prod ? [] : ['twig-templates']), function() {
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

gulp.task('twig-templates', function() {
    return gulp.src([config.src + 'twig/templates/*.twig'], {
            base: 'src/twig/'
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
