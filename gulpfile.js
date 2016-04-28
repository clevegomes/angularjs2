var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    concat = require('gulp-concat'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    tscConfig = require('./tsconfig.json'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass');




var sassSource = ['components/sass/*.scss'],   //Sass Files
    appSrc = 'builds/development/',  // From folder
    typescriptSrc = 'components/typescript/'; //To Folder


/**
 * html and css currently dont do anything but will be needed in production
 * minimize and procees css with postcss
 */
gulp.task('html', function() {
    gulp.src(appSrc + '**/*.html');
});

gulp.task('css', function() {
    gulp.src(appSrc + '**/*.css');
});

/**
 * copying Angular script files
 */
gulp.task('copylibs', function() {
    return gulp
        .src([
            'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/angular2/bundles/angular2-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/angular2/bundles/angular2.dev.js',
            'node_modules/rxjs/bundles/Rx.js'
        ])
        .pipe(concat("script.js"))
        .pipe(gulp.dest(appSrc + 'js'));
});


/**
 * Compiling sass in to css
 */
gulp.task('sass',function () {
    return gulp.src(sassSource)
        .pipe(sass({style: 'expanded', lineNumbers: true}))
        .on('error', gutil.log)
        .pipe(gulp.dest(appSrc + 'css'))
});

/**
 * Compiling typescript in to js
 */
gulp.task('typescript', function () {
    return gulp
        .src(typescriptSrc + '**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        // .pipe(concat("boot.js"))
        .pipe(gulp.dest(appSrc + 'js/'));
});


/**
 * Checking for changes in files and folders and run tasks accordingly
 */
gulp.task('watch', function() {
    gulp.watch(typescriptSrc + '**/*.ts', ['typescript']);
    gulp.watch(appSrc + 'css/*.css', ['css']);
    gulp.watch(appSrc + '**/*.html', ['html']);
});

/**
 * Running a web server
 */
gulp.task('webserver', function() {
    gulp.src(appSrc)
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('default', ['copylibs','sass', 'typescript', 'watch', 'webserver']);