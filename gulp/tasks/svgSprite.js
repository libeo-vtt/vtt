var gulp = require('gulp');
var prettify = require('gulp-prettify');
var svgSprite = require('gulp-svg-sprite');
var cheerio = require('gulp-cheerio');
var config = require('../config.js');

gulp.task('svgSprite', function() {
    return gulp.src(config.src + 'svg/*.svg')
        .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    dest: 'svg',
                    sprite: config.defaults.svgSprite.filename
                }
            }
        }))
        .pipe(gulp.dest(config.build));
});
