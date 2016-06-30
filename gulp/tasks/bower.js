var gulp = require('gulp');
var exec = require('child_process').exec;
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');

var config = require('../config.js');

gulp.task('bower', ['bower:install'], function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest(config.build + 'js/vendor/bower'));
});

gulp.task('bower:export', ['bower:install'], function() {
    return gulp.src(mainBowerFiles())
        .pipe(uglify())
        .pipe(gulp.dest(config.exportPath + 'js/vendor/bower'));
});

gulp.task('bower:install', function(callback) {
    exec('bower install', function(err, stdout, stderr) {
        console.log(stderr);
        callback(err);
    });
});
