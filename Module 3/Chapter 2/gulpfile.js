var gulp = require('gulp');
var typescript = require('gulp-typescript');
var small = require('small').gulp;
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var tsProject = typescript.createProject('lib/tsconfig.json', {
	typescript: require('typescript')
});

gulp.task('compile', function() {
	return gulp.src('lib/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(typescript(tsProject))
		.pipe(small('index.js', {
			externalResolve: ['node_modules'],
			globalModules: {
				"crypto": {
					standalone: "undefined"
				}
			}
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('static/scripts'));
});
gulp.task('release', ['compile'], function() {
	return gulp.src('static/scripts/scripts.js')
		.pipe(uglify())
		.pipe(gulp.dest('static/scripts'));
});

gulp.task('default', ['compile']);
