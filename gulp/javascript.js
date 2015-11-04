var gulp = require('gulp'),
concat = require('gulp-concat');

gulp.task('js', function () {
	gulp.src('javascript/**/*.js')
	.pipe(concat('app.js'))
	.pipe(gulp.dest('public/javascrips'));
});

gulp.task('watch:js', ['js'], function () {
	gulp.watch('javascripts/**/*.js', ['js']);
});

