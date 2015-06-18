var gulp = require('gulp');
var argv = require('yargs').argv;
var compass = require('gulp-compass');

var config = require('../config.js');

gulp.task('compass', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            style: config.minify || argv.prod ? 'compressed' : 'expanded',
            css: config.build + 'css',
            sass: config.src + 'sass',
            image: config.src + 'img',
            relative: true,
            logging: true,
            sourcemap: config.sourcemaps && !argv.prod,
            require: ['sass-globbing']
        }))
        .on('error', function(error) {
            this.emit('end');
        })
        .pipe(gulp.dest(config.build + 'css/'));
});
