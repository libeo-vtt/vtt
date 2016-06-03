var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');

var config = require('../config.js');

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
            runSequence('eslint');
        });
    });
    watch(config.src + 'sass/**/*', function() {
        runSequence('clean:sass', 'watch:sass', function() {
            browserSync.reload();
            runSequence('sasslint');
        });
    });
    watch(config.src + 'img/**/*', function() {
        runSequence('clean:img', 'watch:img', browserSync.reload);
    });
    watch(config.src + 'twig/**/*', function() {
        runSequence('clean:twig', 'watch:twig', browserSync.reload);
    });
    watch(config.src + 'svg/**/*', function() {
        runSequence('clean:svg', 'watch:svg', browserSync.reload);
    });
    watch(config.templates + 'sass/**/*', function() {
        runSequence('clean:sass:templates', 'watch:sass:templates', browserSync.reload);
    });
    watch(config.templates + 'js/**/*', function() {
        runSequence('clean:js:templates', 'watch:js:templates', browserSync.reload);
    });
    watch(config.templates + 'twig/**/*', function() {
        runSequence('clean:twig:templates', 'watch:twig:templates', browserSync.reload);
    });
    watch('bower.json', function() {
        runSequence('clean:bower', 'watch:bower');
    });
});
