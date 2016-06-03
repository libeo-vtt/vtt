var gulp = require('gulp');
var sassLint = require('gulp-sass-lint');
var gulpif = require('gulp-if');

var config = require('../config.js');

gulp.task('sasslint', function() {
    return gulp.src([config.src + '**/*.scss', '!**/*.min.scss', '!**/_mixins.scss'])
        .pipe(gulpif(config.lint.sass, sassLint({
            configFile: './.sass-lint.yml'
        })))
        .pipe(gulpif(config.lint.sass, sassLint.format()));
});
