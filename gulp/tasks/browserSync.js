var gulp = require('gulp');
var browserSync = require('browser-sync');

var config = require('../config.js');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: config.build
        },
        ghostMode: false,
        open: config.defaults.browserSync.open
    });
});
