'use strict';

var browserify  = require('browserify'),
    gulp        = require('gulp'),
    run         = require('gulp-run'),
    transform   = require('vinyl-transform'),
    uglify      = require('gulp-uglify'),
    sourcemaps  = require('gulp-sourcemaps'),
    ts          = require('gulp-typescript'),
    tslint      = require('gulp-tslint'),
    sass        = require('gulp-sass'),
    scsslint    = require('gulp-scss-lint'),
    minifyCSS   = require('gulp-minify-css'),
    del         = require('del'),
    browserSync = require('browser-sync'),
    jsonlint    = require("gulp-jsonlint"),
    karma       = require("gulp-karma"),
    runSequence = require('run-sequence');

var tsProject = ts.createProject({
    removeComments : true,
    noImplicitAny : true,
    target : 'ES3',
    module : 'commonjs',
    declarationFiles : false
});

gulp.task('install', function(cb) {
  run('npm install').exec("", function(){
    run('tsd reinstall -so').exec("", function(){
      run('bower install').exec("", cb);
    });
  });
});

gulp.task('clean', function (cb) {
  del(['./temp'], function(){
    del(['./dist'], cb);
  });
});

gulp.task('ts-lint', function() {
  return gulp.src(['./source/ts/**/**.ts', './test/**/**.test.ts'])
             .pipe(tslint())
             .pipe(tslint.report('verbose'));
});

gulp.task('tsc', function() {
  // build app
  return gulp.src('./source/ts/**/**.ts')
             .pipe(ts(tsProject))
             .js.pipe(gulp.dest('./temp/source/js'));
});

gulp.task('tsc-tests', function() {
  // build tests
  return gulp.src('./test/**/**.test.ts')
             .pipe(ts(tsProject))
             .js.pipe(gulp.dest('./temp/test/'));
});

gulp.task('lint-json', function() {
  return gulp.src('./data/*.json')
             .pipe(jsonlint())
             .pipe(jsonlint.reporter());
});

gulp.task('scss-lint', function() {
  return gulp.src('./source/scss/*.scss')
             .pipe(scsslint());
});

gulp.task('scss', function () {
  return gulp.src('./source/scss/*.scss')
             .pipe(sass())
             .pipe(gulp.dest('./temp/source/css/'));
});

gulp.task('bundle-css', function() {
  return gulp.src('./temp/source/css/*.css')
             .pipe(minifyCSS())
             .pipe(gulp.dest('./dist/source/css/'))
});

gulp.task('bundle-js', function () {
  // transform regular node stream to gulp (buffered vinyl) stream
  var browserified = transform(function(filename) {
    var b = browserify({ entries: filename, debug: true });
    return b.bundle();
  });

  return gulp.src('./temp/source/js/main.js')
             .pipe(browserified)
             .pipe(sourcemaps.init({ loadMaps: true }))
             .pipe(uglify())
             .pipe(sourcemaps.write('./'))
             .pipe(gulp.dest('./dist/source/js/'));
});

gulp.task('bundle-test', function () {
  // transform regular node stream to gulp (buffered vinyl) stream
  var browserified = transform(function(filename) {
    var b = browserify({ entries: filename, debug: true });
    return b.bundle();
  });

  return gulp.src('./temp/test/**/**.test.js')
             .pipe(browserified)
             .pipe(gulp.dest('./dist/test/'));
});

gulp.task('karma', function(cb) {
  gulp.src('./dist/test/**/**.test.js')
      .pipe(karma({
         configFile: 'karma.conf.js',
         action: 'run'
       }))
       .on('end', cb)
       .on('error', function(err) {
         // Make sure failed tests cause gulp to exit non-zero
         throw err;
       });
});

gulp.task('browser-sync', ['test'], function() {
  browserSync({
    server: {
      baseDir: "./dist"
    }
  });

  return gulp.watch([
    "./dist/source/js/**/*.js",
    "./dist/source/css/**.css",
    "./dist/test/**/**.test.js",
    "./dist/data/**/**",
    "./index.html"
  ], [browserSync.reload]);
});

gulp.task('copy:index', function (cb) {
  return gulp.src('./index.html')
             .pipe(gulp.dest('./dist'));
});

gulp.task('copy:data', function (cb) {
  return gulp.src('./data/**/**')
             .pipe(gulp.dest('./dist/data'));
});

gulp.task('copy:hbs', function (cb) {
  return gulp.src('./source/hbs/**/**.hbs')
             .pipe(gulp.dest('./dist/source/hbs/'));
});

gulp.task('copy:bower', function (cb) {
  return gulp.src('./bower_components/**/**')
             .pipe(gulp.dest('./dist/bower_components/'));
});

gulp.task('copy:npm', function (cb) {
  return gulp.src('./node_modules/**/**')
             .pipe(gulp.dest('./dist/node_modules/'));
});

gulp.task('lint', function(cb) {
  runSequence(['install', 'ts-lint', 'scss-lint', 'lint-json'], cb);
});

gulp.task('build', function(cb) {
  runSequence('lint', ['tsc', 'tsc-tests', 'scss'], cb);
});

gulp.task('bundle', function(cb) {
  runSequence('build', [
    'bundle-js', 'bundle-test', 'bundle-css', 'copy:index',
    'copy:data', 'copy:hbs', 'copy:bower','copy:npm'
  ], cb);
});

gulp.task('test', function(cb) {
  runSequence('bundle', ['karma'], cb);
});

gulp.task('serve', function(cb) {
  runSequence('test', 'browser-sync', cb);
});

gulp.task('default', ['test']);
