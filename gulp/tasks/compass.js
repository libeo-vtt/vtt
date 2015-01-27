var gulp = require('gulp');
var compass = require('gulp-compass');

var config = require('../config.js');

gulp.task('compass', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(compass({
            style: config.minify ? 'compressed' : 'expanded',
            css: config.build + 'css',
            sass: config.src + 'sass',
            image: config.src + 'img',
            relative: true,
            logging: config.defaults.compass.logging,
            sourcemap: config.sourcemaps,
            require: ['sass-globbing']
        }))
        .pipe(gulp.dest(config.build + 'css/'));
});
