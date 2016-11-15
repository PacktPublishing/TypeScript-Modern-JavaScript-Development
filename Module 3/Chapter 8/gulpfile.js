var gulp = require("gulp");
var ts = require("gulp-typescript");
var small = require("small").gulp;

var tsProject = ts.createProject("lib/tsconfig.json", { typescript: require("typescript") });

gulp.task("compile", function() {
	return gulp.src("lib/**/*.ts")
		.pipe(ts(tsProject))
		.pipe(small("game/index.js", { outputFileName: { standalone: "scripts.js" }}))
		.pipe(gulp.dest("static/scripts/"));
});
gulp.task("default", ["compile"]);