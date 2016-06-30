var gulp = require('gulp');
var _ = require('lodash');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var config = require('../config.js');

var helpers = require('../../' + config.src + 'js/helpers.js');

_.forEach(helpers, function(value, key) {
    helpers[key] = config.src + 'js/helpers/' + value;
});

gulp.task('concat:helpers', function() {
    return gulp.src(helpers)
        .pipe(concat('helpers.js'))
        .pipe(gulp.dest(config.build + 'js'));
});

gulp.task('concat:helpers:export', function() {
    return gulp.src(helpers)
        .pipe(concat('helpers.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.exportPath + 'js'));
});

gulp.task('concat:templates', function() {
    return gulp.src([
        './templates/js/jquery.templatesManager.js',
        './templates/js/jquery.templatesColors.js',
        './templates/js/jquery.templatesFonts.js',
        './templates/js/jquery.templatesTypography.js',
        './templates/js/jquery.templatesBreakpoints.js'
    ])
    .pipe(concat('templates.js'))
    .pipe(gulp.dest(config.build + 'templates/js'));
});
