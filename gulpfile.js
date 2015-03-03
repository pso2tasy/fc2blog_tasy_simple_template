var gulp = require('gulp');

var stylus = require('gulp-stylus');
gulp.task('stylus', function() {
	gulp.src('src/stylus/*.styl')
		.pipe(stylus())
		.pipe(gulp.dest('public/css/'));
});

var jade = require('gulp-jade');
gulp.task('jade', function() {
	gulp.src('src/jade/**/*.jade')
		.pipe(jade({pretty:true}))
		.pipe(gulp.dest('public/'));
});

gulp.task('default', function() {
	gulp.run('jade');
	gulp.run('stylus');
	gulp.watch('src/jade/**', function() {
		gulp.run('jade');
	});
	gulp.watch('src/stylus/**', function() {
		gulp.run('stylus');
	});
});
