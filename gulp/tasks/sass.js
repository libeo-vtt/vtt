var gulp = require('gulp');
var argv = require('yargs').argv;
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var postcss = require('gulp-postcss');
var plumber = require('gulp-plumber');
var notifier = require('node-notifier');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var cssGlobbing = require('gulp-css-globbing');
var jsonImporter = require('../helpers/json-importer.js');
var customFunctions = require('../helpers/sass.customFunctions.js');

var config = require('../config.js');

var sassConfig = {
    indentWidth: 4,
    importer: jsonImporter,
    outputStyle: config.minify || argv.prod ? 'compressed' : 'expanded',
    functions: customFunctions
};

gulp.task('sass', (argv.prod ? [] : ['sass:templates']), function() {
    return gulp.src([config.src + 'sass/*.scss', '!' + config.src + 'sass/templates.scss'])
        .pipe(plumber({
            errorHandler: function(error) {
                notifier.notify({
                    'title': 'Compiling Error: Sass',
                    'message': error.message.replace('\n', '')
                });
                gutil.log(gutil.colors.red('Error: ' + error.message.replace('\n', '')));
            }
        }))
        .pipe(cssGlobbing({
            extensions: ['.css', '.scss'],
            scssImportPath: {
                leading_underscore: false,
                filename_extension: false
            }
        }))
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.init()))
        .pipe(sass({
            indentWidth: 4,
            importer: jsonImporter,
            outputStyle: 'compressed',
            functions: customFunctions
        }))
        .pipe(postcss([autoprefixer({ browsers: ['last 2 versions', 'ie 10-11', 'iOS 8'] })]))
        .pipe(gulp.dest(config.build + 'css/'));
});

gulp.task('sass:export', function() {
    return gulp.src([config.src + 'sass/*.scss', '!' + config.src + 'sass/templates.scss'])
        .pipe(cssGlobbing({
            extensions: ['.css', '.scss'],
            scssImportPath: {
                leading_underscore: false,
                filename_extension: false
            }
        }))
        .pipe(sass(sassConfig))
        .pipe(postcss([autoprefixer({ browsers: ['last 2 versions', 'ie 10-11', 'iOS 8'] })]))
        .pipe(gulp.dest(config.exportPath + 'css/'));
});

gulp.task('sass:templates', function() {
    return gulp.src(config.templates + 'sass/templates.scss')
        .pipe(cssGlobbing({
            extensions: ['.css', '.scss'],
            scssImportPath: {
                leading_underscore: false,
                filename_extension: false
            }
        }))
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.init()))
        .pipe(sass(sassConfig))
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.write('./')))
        .pipe(gulp.dest(config.build + 'templates/css/'));
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
        .pipe(sass(sassConfig))
        .pipe(gulpif(config.sourcemaps && !argv.prod, sourcemaps.write('./')))
        .pipe(gulp.dest(config.build + 'documentation/'));
});
