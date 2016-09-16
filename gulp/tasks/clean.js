var gulp = require('gulp');
var del = require('del');

var config = require('../config.js');

gulp.task('clean', function(callback) {
    return del([config.build], callback);
});

gulp.task('clean:templates', function(callback) {
    return del([config.build + 'templates'], callback);
});

gulp.task('clean:sass:templates', function(callback) {
    return del([config.build + 'templates/css'], callback);
});

gulp.task('clean:js:templates', function(callback) {
    return del([config.build + 'templates/js'], callback);
});

gulp.task('clean:twig:templates', function(callback) {
    return del([config.build + 'templates/*.html'], callback);
});

gulp.task('clean:bower', function(callback) {
    return del([config.build + 'js/vendor/bower'], callback);
});

gulp.task('clean:bower_components', function(callback) {
    return del(['./bower_components'], callback);
});

gulp.task('clean:js', function(callback) {
    return del([config.build + 'js'], callback);
});

gulp.task('clean:img', function(callback) {
    return del([config.build + 'img'], callback);
});

gulp.task('clean:sass', function(callback) {
    return del([config.build + 'css'], callback);
});

gulp.task('clean:twig', function(callback) {
    return del([config.build + '*.html'], callback);
});

gulp.task('clean:svg', function(callback) {
    return del([config.build + 'svg'], callback);
});

