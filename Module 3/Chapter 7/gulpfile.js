var gulp = require("gulp");
var ts = require("gulp-typescript");
var small = require("small").gulp;

var tsProject = ts.createProject("lib/tsconfig.json", { typescript: require("typescript") });

gulp.task("compile", function() {
	return gulp.src(["lib/**/*.ts", "lib/**/*.tsx"])
		.pipe(ts(tsProject))
		.pipe(gulp.dest("dist"))
		.pipe(small("client/index.js", { externalResolve: ["node_modules"], outputFileName: { standalone: "client.js" } }))
		.pipe(gulp.dest("static/scripts/"));
});
