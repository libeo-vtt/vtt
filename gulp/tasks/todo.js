var gulp = require('gulp');
var todo = require('gulp-todo');

var config = require('../config.js');

gulp.task('todo', function() {
    return gulp.src([
            './src/sass/**/*.scss',
            './src/js/**/*.js'
        ])
        .pipe(todo())
        .pipe(todo.reporter('markdown', {
            transformHeader: function(kind) {
                return ['| Filename | line # | ' + kind,
                    '|-------|--------|-------|'
                ];
            }
        }))
        .pipe(gulp.dest('./'));
});
