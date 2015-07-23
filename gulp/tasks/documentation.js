var gulp = require('gulp');
var gulpif = require('gulp-if');
var shell = require('gulp-shell');
var config = require('../config.js');

gulp.task('documentation', shell.task([
    'node_modules/beautiful-docs/bin/bfdocs --theme=documentation/theme documentation/manifest.json build/documentation > /dev/null'
]));
