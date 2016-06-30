var gulp = require('gulp');
var argv = require('yargs').argv;
var requireDir = require('require-dir');
var runSequence = require('run-sequence');

require('gulp-release-tasks')(gulp);

requireDir('./gulp/tasks', { recurse: true });

gulp.task('build', ['bower', 'sass', 'copy', 'concat:helpers', 'concat:templates', 'svg2png', 'svgSprite', 'twig']);
gulp.task('export', ['bower:export', 'sass:export', 'copy:export', 'concat:helpers:export', 'svg2png:export', 'svgSprite:export']);
gulp.task('default', function() {
    runSequence('clean', 'build', 'symlink', 'watch');
});
