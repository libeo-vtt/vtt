var gulp = require('gulp');
var argv = require('yargs').argv;
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var cssGlobbing = require('gulp-css-globbing');
var customFunctions = require('../helpers/sass.customFunctions.js');

var config = require('../config.js');
var sass_config = {
    indentWidth: 4,
    outputStyle: config.minify || argv.prod ? 'compressed' : 'expanded',
    functions: customFunctions
};

gulp.task('sass', (argv.prod ? [] : ['sass-templates']), function() {
    return gulp.src([config.src + 'sass/*.scss', '!' + config.src + 'sass/templates.scss'])
        .pipe(cssGlobbing({
            extensions: ['.css', '.scss'],
            scssImportPath: {
                leading_underscore: false,
                filename_extension: false
            }
        }))
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.init()))
        .pipe(sass(sass_config))
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.write('./')))
        .pipe(gulp.dest(config.build + 'css/'));
});

gulp.task('sass-templates', function() {
    return gulp.src(config.src + 'sass/templates.scss')
        .pipe(cssGlobbing({
            extensions: ['.css', '.scss'],
            scssImportPath: {
                leading_underscore: false,
                filename_extension: false
            }
        }))
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.init()))
        .pipe(sass(sass_config))
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.write('./')))
        .pipe(gulp.dest(config.build + 'css/'));
});

gulp.task('sass-documentation', function() {
    return gulp.src('./documentation/documentation.scss')
        .pipe(cssGlobbing({
            extensions: ['.css', '.scss'],
            scssImportPath: {
                leading_underscore: false,
                filename_extension: false
            }
        }))
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.init()))
        .pipe(sass(sass_config))
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.write('./')))
        .pipe(gulp.dest(config.build + 'documentation/'));
});
