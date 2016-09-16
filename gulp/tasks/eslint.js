var gulp = require('gulp');
var eslint = require('gulp-eslint');
var gulpif = require('gulp-if');

var config = require('../config.js');

gulp.task('eslint', function() {
    return gulp.src([config.src + '**/*.js', '!**/*.min.js'])
        .pipe(gulpif(config.lint.js, eslint({
            configFile: './.eslintrc.js'
        })))
        .pipe(gulpif(config.lint.js, eslint.format()));
});
