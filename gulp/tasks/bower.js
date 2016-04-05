var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var config = require('../config.js');

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest(config.build + 'js/vendor/bower'));
});
