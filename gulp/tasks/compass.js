var gulp = require('gulp');
var argv = require('yargs').argv;
var compass = require('gulp-compass');
var runSequence = require('run-sequence');

var config = require('../config.js');
var compass_config = {
    config_file: './config.rb',
    style: config.minify || argv.prod ? 'compressed' : 'expanded',
    css: config.build + 'css',
    sass: config.src + 'sass',
    image: config.src + 'img',
    relative: true,
    logging: true,
    sourcemap: config.sourcemaps && !argv.prod,
    require: ['sass-globbing']
};

gulp.task('compass-default', function() {
    return gulp.src(['./src/sass/*.scss', '!./src/sass/templates.scss'])
        .pipe(compass(compass_config))
        .on('error', function(error) {
            this.emit('end');
        })
        .pipe(gulp.dest(config.build + 'css/'));
});

gulp.task('compass-templates', function() {
    return gulp.src('./src/sass/templates.scss')
        .pipe(compass(compass_config))
        .on('error', function(error) {
            this.emit('end');
        })
        .pipe(gulp.dest(config.build + 'css/'));
});

gulp.task('compass', function() {
    if (argv.prod) {
        runSequence(['compass-default']);
    } else {
        runSequence(['compass-default', 'compass-templates']);
    }
});
