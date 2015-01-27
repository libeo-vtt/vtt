var gulp = require('gulp');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');

requireDir('./gulp/tasks', { recurse: true });

gulp.task('build', ['browserify', 'compass', 'copy', 'svg2png', 'svgSprite', 'twig']);
gulp.task('default', function() {
    runSequence('clean', 'build', 'symlink', 'watch');
});
