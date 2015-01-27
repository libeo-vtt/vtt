var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function(callback) {
    return del(['build'], callback);
});

gulp.task('clean:js', function(callback) {
    return del(['build/js'], callback);
});

gulp.task('clean:img', function(callback) {
    return del(['build/img'], callback);
});

gulp.task('clean:sass', function(callback) {
    return del(['build/css'], callback);
});

gulp.task('clean:twig', function(callback) {
    return del(['build/*.html'], callback);
});

gulp.task('clean:svg', function(callback) {
    return del(['build/svg'], callback);
});

gulp.task('clean:twig', function(callback) {
    return del(['build/*.html'], callback);
});
