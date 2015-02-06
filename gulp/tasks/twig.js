var gulp = require('gulp');
var twig = require('gulp-twig');
var prettify = require('gulp-prettify');
var config = require('../config.js');
var extendTwig = require('../helpers/twig.exports.extendTag.js');
var customFunctions = require('../helpers/twig.customFunctions.js');
var customTags = require('../helpers/twig.customTags.js');

gulp.task('twig', function() {
    return gulp.src([config.src + 'twig/*.twig', config.src + 'twig/templates/*.twig'], {
            base: 'src/twig/'
        })
        .pipe(twig({
            //data: require('../../' + config.src + 'twig/data.js'),
            functions: customFunctions,
            extend: function(Twig) {
                return extendTwig(Twig, customTags);
            }
        }))
        .pipe(prettify(config.prettify))
        .pipe(gulp.dest(config.build));
});
