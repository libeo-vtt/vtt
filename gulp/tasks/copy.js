var gulp = require('gulp');
var config = require('../config.js');

gulp.task('copy:js', function() {
    return gulp.src([
            config.src + 'js/vendor/modernizr*.js',
            config.src + 'js/vendor/detectizr*.js'
        ])
        .pipe(gulp.dest(config.build + 'js/vendor'));
});

gulp.task('copy:img', function() {
    return gulp.src(config.src + 'img/**/*')
        .pipe(gulp.dest(config.build + 'img'));
});

gulp.task('copy:svg', function() {
    return gulp.src(config.src + 'svg/**/*')
        .pipe(gulp.dest(config.build + 'svg/originals'));
});

gulp.task('copy', ['copy:js', 'copy:img', 'copy:svg']);
