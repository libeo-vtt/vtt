var gulp = require('gulp');
var gulpif = require('gulp-if');
var svg2png = require('gulp-svg2png');
var config = require('../config.js');

gulp.task('svg2png', function() {
    return gulp.src(config.src + 'svg/*.svg')
        .pipe(gulpif(config.svgFallback, svg2png()))
        .pipe(gulpif(config.svgFallback, gulp.dest(config.build + 'img/svg-fallbacks/')));
});
