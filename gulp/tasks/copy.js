var gulp = require('gulp');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');

var config = require('../config.js');

gulp.task('copy:js', function() {
    return gulp.src([
        config.src + 'js/**/*.js',
        '!' + config.src + 'js/helpers.js',
        '!' + config.src + 'js/helpers/**/*'
    ])
    .pipe(gulp.dest(config.build + 'js'));
});

gulp.task('copy:js:export', function() {
    return gulp.src([
        config.src + 'js/**/*.js',
        '!' + config.src + 'js/helpers.js',
        '!' + config.src + 'js/helpers/**/*'
    ])
    .pipe(uglify())
    .pipe(gulp.dest(config.exportPath + 'js'));
});

gulp.task('copy:js:templates', function() {
    return gulp.src([
        config.templates + 'js/**/*.js'
    ])
    .pipe(gulp.dest(config.build + 'templates/js'));
});

gulp.task('copy:img', function() {
    return gulp.src(config.src + 'img/**/*')
        .pipe(gulpif(config.imagemin || argv.prod, imagemin()))
        .pipe(gulp.dest(config.build + 'img'));
});

gulp.task('copy:img:export', function() {
    return gulp.src(config.src + 'img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.exportPath + 'img'));
});

gulp.task('copy:fonts', function() {
    return gulp.src(config.src + 'fonts/**/*')
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('copy:fonts:export', function() {
    return gulp.src(config.src + 'fonts/**/*')
        .pipe(gulp.dest(config.exportPath + 'fonts'));
});

gulp.task('copy:svg', function() {
    return gulp.src(config.src + 'svg/**/*')
        .pipe(gulp.dest(config.build + 'svg/originals'));
});

gulp.task('copy:svg:export', function() {
    return gulp.src(config.src + 'svg/**/*')
        .pipe(gulp.dest(config.exportPath + 'svg/originals'));
});

gulp.task('copy', ['copy:js', 'copy:js:templates', 'copy:img', 'copy:fonts', 'copy:svg']);
gulp.task('copy:export', ['copy:js:export', 'copy:img:export', 'copy:fonts:export', 'copy:svg:export']);
