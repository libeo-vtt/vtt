var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var config = require('../config.js');

gulp.task('watch:js', ['browserify', 'copy:js']);
gulp.task('watch:img', ['copy:img']);
gulp.task('watch:sass', ['sass']);
gulp.task('watch:twig', ['twig']);
gulp.task('watch:svg', ['svg2png', 'svgSprite', 'copy:svg']);

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(config.src + 'js/**/*', function() {
        runSequence('clean:js', 'watch:js', browserSync.reload);
    });
    gulp.watch(config.src + 'img/**/*', function() {
        runSequence('clean:img', 'watch:img', browserSync.reload);
    });
    gulp.watch(config.src + 'sass/**/*', function() {
        runSequence('clean:sass', 'watch:sass', browserSync.reload);
    });
    gulp.watch(config.src + 'twig/**/*', function() {
        runSequence('clean:twig', 'watch:twig', browserSync.reload);
    });
    gulp.watch(config.src + 'svg/**/*', function() {
        runSequence('clean:svg', 'watch:svg', browserSync.reload);
    });
});
