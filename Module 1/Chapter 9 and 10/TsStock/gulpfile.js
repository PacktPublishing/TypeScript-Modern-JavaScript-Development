"use strict";

//******************************************************************************
//* DEPENDENCIES
//******************************************************************************
var gulp        = require("gulp"),
    browserify  = require("browserify"),
    source      = require("vinyl-source-stream"),
    buffer      = require("vinyl-buffer"),
    //run         = require("gulp-run"),
    tslint      = require("gulp-tslint"),
    tsc         = require("gulp-typescript"),
    karma       = require("karma").server,
    coveralls   = require('gulp-coveralls'),
    uglify      = require("gulp-uglify"),
    runSequence = require("run-sequence"),
    //header      = require("gulp-header"),
    browserSync = require("browser-sync"),
    reload      = browserSync.reload,
    pkg         = require(__dirname + "/package.json");

//******************************************************************************
//* LINT
//******************************************************************************
gulp.task("lint", function() {
  return gulp.src([
                __dirname + "/source/**/**.ts",
                __dirname + "/test/**/**.test.ts"
              ])
             .pipe(tslint())
             .pipe(tslint.report("verbose"));
});

//******************************************************************************
//* BUILD
//******************************************************************************
var tsProject = tsc.createProject({
  removeComments : false,
  noImplicitAny : false,
  target : "ES5",
  module : "commonjs",
  declarationFiles : false,
  experimentalDecorators : true
});

gulp.task("build-source", function() {
  return gulp.src(__dirname + "/source/**/**.ts")
             .pipe(tsc(tsProject))
             .js.pipe(gulp.dest(__dirname + "/build/source/"));
});

gulp.task("build-test", function() {
  return gulp.src(__dirname + "/test/*.test.ts")
             .pipe(tsc(tsProject))
             .js.pipe(gulp.dest(__dirname + "/build/test/"));
});

gulp.task("build", function(cb) {
  runSequence("lint", "build-source", "build-test", cb);
});

//******************************************************************************
//* BUNDLE
//******************************************************************************
gulp.task("bundle-source", function () {
  var b = browserify({
    standalone : 'TsStock',
    entries: __dirname + "/build/source/app/main.js",
    debug: true
  });

  return b.bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(gulp.dest(__dirname + "/bundled/source/"));
});

gulp.task("bundle-test", function () {
  var b = browserify({
    entries: __dirname + "/build/test/inversify.test.js",
    debug: true
  });

  return b.bundle()
    .pipe(source("inversify.test.js"))
    .pipe(buffer())
    .pipe(gulp.dest(__dirname + "/bundled/test/"));
});

gulp.task("bundle", function(cb) {
  runSequence("build", "bundle-source", "bundle-test", "document", cb);
});

//******************************************************************************
//* TEST
//******************************************************************************
gulp.task("karma", function(cb) {
  karma.start({
    configFile : __dirname + "/karma.conf.js",
    singleRun: true
  }, cb);
});

gulp.task("cover", function() {
  return gulp.src(__dirname + '/coverage/**/lcov.info')
      .pipe(coveralls());
});

gulp.task("test", function(cb) {
  runSequence("bundle", "karma", "cover", cb);
});

//******************************************************************************
//* BAKE
//******************************************************************************
gulp.task("compress", function() {
  return gulp.src(__dirname + "/bundled/source/inversify.js")
             .pipe(uglify({ preserveComments : false }))
             .pipe(gulp.dest(__dirname + "/dist/"))
});

gulp.task("header", function() {

  var pkg = require(__dirname + "/package.json");

  var banner = ["/**",
    " * <%= pkg.name %> v.<%= pkg.version %> - <%= pkg.description %>",
    " * Copyright (c) 2015 <%= pkg.author %>",
    " * <%= pkg.license %> inversify.io/LICENSE",
    " * <%= pkg.homepage %>",
    " */",
    ""].join("\n");

  return gulp.src(__dirname + "/dist/inversify.js")
             .pipe(header(banner, { pkg : pkg } ))
             .pipe(gulp.dest(__dirname + "/dist/"));
});

gulp.task("bake", function(cb) {
  runSequence("bundle", "compress", "header", cb);
});

//******************************************************************************
//* SERVE
//******************************************************************************
gulp.task("serve", function(cb) {
    browserSync({
        port: 8080,
        server: {
            baseDir: __dirname + "/"
        }
    });

    gulp.watch([
      __dirname + "/node_modules/**/*.css",
      __dirname + "/node_modules/**/*.js",
      __dirname + "/source/**/*.ts",
      __dirname + "/test/**/*.ts",
      __dirname + "/css/**/*.css",
      __dirname + "/img/**/*.css",
      __dirname + "/index.html"
    ], browserSync.reload, cb);
});

//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task("default", function (cb) {
  runSequence(
    "lint",
    "build-source",
    "build-test",
    "bundle-source",
    "bundle-test",
    "document",
    "karma",
    "cover",
    "compress",
    "header",
    cb);
});
