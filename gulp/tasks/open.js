var gulp = require('gulp');
var open = require('gulp-open');
var util = require('gulp-util');
var gulpif = require('gulp-if');
var config = require('../config.js');

gulp.task('open', function() {
    return gulp.src(config.build + 'index.html')
        .pipe(gulpif(util.env.open, open('', {
            url: 'http://localhost:3000'
        })));
});
