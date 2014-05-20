var gulp = require('gulp'),
    plugins = require("gulp-load-plugins")();

var build_dir = "build";

function build(stream, file) {
	return stream
	.pipe(plugins.jshint())
	.pipe(plugins.jshint.reporter('jshint-stylish'))
	.pipe(plugins.concat(file))
	.pipe(gulp.dest(build_dir))
	.pipe(plugins.rename({suffix: '.min'}))
	.pipe(plugins.uglify())
	.pipe(gulp.dest(build_dir));
}


gulp.task('default', function(){
	return build(gulp.src([
		'LICENSE',
		'source/horizontally.js',
	]), 'horizontally.js');
});

gulp.task('watch', function() {
  gulp.watch('source/**/*.js', ['default']);
});