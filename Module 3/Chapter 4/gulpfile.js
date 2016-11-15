var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var typescript = require("gulp-typescript");
var small = require("small").gulp;
var uglify = require("gulp-uglify");

var tsServer = typescript.createProject("lib/tsconfig.json", { typescript: require("typescript") });
var tsClient = typescript.createProject("lib/tsconfig.json", { typescript: require("typescript"), target: "es5" });

gulp.task("compile-client", function() {
	return gulp.src(["lib/client/**/*.ts", "lib/client/**/*.tsx", "lib/shared/**/*.ts"], { base: "lib" })
		.pipe(sourcemaps.init())
		.pipe(typescript(tsClient))
		.pipe(small("client/index.js", { outputFileName: { standalone: "scripts.js" }, externalResolve: ["node_modules"] }))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("static/scripts"));
});
gulp.task("compile-server", function() {
	return gulp.src(["lib/server/**/*.ts", "lib/shared/**/*.ts"], { base: "lib" })
		.pipe(sourcemaps.init())
		.pipe(typescript(tsServer))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("dist"));
});
gulp.task("release", ["compile-client", "compile-server"], function() {
	return gulp.src("static/scripts/**.js")
		.pipe(uglify())
		.pipe(gulp.dest("static/scripts"));
});

gulp.task("default", ["compile-client", "compile-server"]);
