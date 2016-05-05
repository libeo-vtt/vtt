var gulp = require('gulp');
var argv = require('yargs').argv;
var requireDir = require('require-dir');
var runSequence = require('run-sequence');

requireDir('./gulp/tasks', { recurse: true });

gulp.task('build', ['bower', 'sass', 'copy', 'concat:helpers', 'concat:templates', 'svg2png', 'svgSprite', 'twig']);
gulp.task('default', function() {
    runSequence('clean', 'build', 'symlink', 'watch');
});
