var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');

gulp.task('watch:js', ['browserify', 'copy:js']);
gulp.task('watch:img', ['copy:img']);
gulp.task('watch:sass', ['sass']);
gulp.task('watch:twig', ['twig', 'twig-templates']);
gulp.task('watch:svg', ['svg2png', 'svgSprite', 'copy:svg']);

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('./src/js/**/*', function() {
        runSequence('clean:js', 'watch:js', browserSync.reload);
    });
    gulp.watch('./src/img/**/*', function() {
        runSequence('clean:img', 'watch:img', browserSync.reload);
    });
    gulp.watch('./src/sass/**/*', function() {
        runSequence('clean:sass', 'watch:sass', browserSync.reload);
    });
    gulp.watch('./src/twig/**/*', function() {
        runSequence('clean:twig', 'watch:twig', browserSync.reload);
    });
    gulp.watch('./src/svg/**/*', function() {
        runSequence('clean:svg', 'watch:svg', browserSync.reload);
    });
});
