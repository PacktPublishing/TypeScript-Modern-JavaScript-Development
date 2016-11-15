var gulp = require("gulp");
var ts = require("gulp-typescript");

var tsProject = ts.createProject("./lib/tsconfig.json", { typescript: require("typescript") });

gulp.task("default", function() {
	return tsProject.src()
		.pipe(ts(tsProject))
		.pipe(gulp.dest("dist"));
});
