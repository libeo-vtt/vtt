var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var watch = require('gulp-watch');

var config = require('../config.js');
var package = require('../../package.json');

var completedMessage = 'Watch task completed\n\nCurrently watching project → ' + package.name + '\n';

gulp.task('watch:js', ['bower', 'concat:helpers', 'copy:js']);
gulp.task('watch:img', ['copy:img']);
gulp.task('watch:sass', ['sass']);
gulp.task('watch:twig', ['twig']);
gulp.task('watch:svg', ['svg2png', 'svgSprite', 'copy:svg']);
gulp.task('watch:svg:templates', ['copy:svg:templates']);
gulp.task('watch:sass:templates', ['sass:templates']);
gulp.task('watch:js:templates', ['copy:js:templates', 'concat:templates']);
gulp.task('watch:twig:templates', ['twig:templates']);
gulp.task('watch:bower', ['bower']);

gulp.task('watch', ['browser-sync'], function() {
    watch(config.src + 'js/**/*', function() {
        runSequence('clean:js', 'watch:js', function() {
            browserSync.reload();
            runSequence('eslint', function() {
                gutil.log(gutil.colors.green(completedMessage));
            });
        });
    });
    watch(config.src + 'sass/**/*', function() {
        runSequence('clean:sass', 'watch:sass', function() {
            browserSync.reload();
            runSequence('sasslint', function() {
                gutil.log(gutil.colors.green(completedMessage));
            });
        });
    });
    watch(config.src + 'img/**/*', function() {
        runSequence('clean:img', 'watch:img', function() {
            browserSync.reload();
            gutil.log(gutil.colors.green(completedMessage));
        });
    });
    watch(config.src + 'twig/**/*', function() {
        runSequence('clean:twig', 'watch:twig', function() {
            browserSync.reload();
            gutil.log(gutil.colors.green(completedMessage));
        });
    });
    watch(config.src + 'svg/**/*', function() {
        runSequence('clean:svg', 'watch:svg', function() {
            browserSync.reload();
            gutil.log(gutil.colors.green(completedMessage));
        });
    });
    watch(config.templates + 'sass/**/*', function() {
        runSequence('clean:sass:templates', 'watch:sass:templates', function() {
            browserSync.reload();
            gutil.log(gutil.colors.green(completedMessage));
        });
    });
    watch(config.templates + 'js/**/*', function() {
        runSequence('clean:js:templates', 'watch:js:templates', function() {
            browserSync.reload();
            gutil.log(gutil.colors.green(completedMessage));
        });
    });
    watch(config.templates + 'twig/**/*', function() {
        runSequence('clean:twig:templates', 'watch:twig:templates', function() {
            browserSync.reload();
            gutil.log(gutil.colors.green(completedMessage));
        });
    });
    watch('bower.json', function() {
        runSequence('clean:bower', 'watch:bower', function() {
            gutil.log(gutil.colors.green(completedMessage));
        });
    });
});
