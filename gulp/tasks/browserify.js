var gulp = require('gulp');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../config');

gulp.task('browserify', function() {
    return browserify({
            entries: [config.src + 'js/main.js'],
            debug: config.sourcemaps
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.init({
            loadMaps: config.sourcemaps
        })))
        .pipe(gulpif(config.minify || argv.prod, uglify()))
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.write('./')))
        .pipe(gulp.dest(config.build + 'js/'));
});
