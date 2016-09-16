var gulp = require('gulp');
var svgSprite = require('gulp-svg-sprite');
var cheerio = require('gulp-cheerio');

var config = require('../config.js');

var cheerioConfig = {
    run: function($) {
        $('[fill]').removeAttr('fill');
    },
    parserOptions: {
        xmlMode: true
    }
};

var svgSpriteConfig = {
    mode: {
        symbol: {
            dest: 'svg',
            sprite: config.defaults.svgSprite.filename
        }
    },
    svg: {
        dimensionAttributes: false
    }
};

gulp.task('svgSprite', function() {
    return gulp.src(config.src + 'svg/*.svg')
        .pipe(cheerio(cheerioConfig))
        .pipe(svgSprite(svgSpriteConfig))
        .pipe(gulp.dest(config.build));
});

gulp.task('svgSprite:export', function() {
    return gulp.src(config.src + 'svg/*.svg')
        .pipe(cheerio(cheerioConfig))
        .pipe(svgSprite(svgSpriteConfig))
        .pipe(gulp.dest(config.exportPath));
});
