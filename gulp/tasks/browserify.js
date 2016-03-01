var gulp = require('gulp');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var notifier = require('node-notifier');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../config');

gulp.task('browserify', function() {
    return browserify({
            entries: [config.src + 'js/main.js'],
            debug: config.sourcemaps
        })
        .bundle()
        .on('error', function(error) {
            notifier.notify({
                'title': 'Compiling Error: Browserify',
                'message': error.message.replace('\n', '')
            });
            gutil.log(gutil.colors.red('Error: ' + error.message));
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.init({
            loadMaps: config.sourcemaps
        })))
        .pipe(gulpif(config.minify || argv.prod, uglify()))
        .on('error', function(error) {
            notifier.notify({
                'title': 'Compiling Error: Uglify',
                'message': error.message.replace('\n', '')
            });
            gutil.log(gutil.colors.red('Error: ' + error.message));
            this.emit('end');
        })
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.write('./')))
        .pipe(gulp.dest(config.build + 'js/'));
});
