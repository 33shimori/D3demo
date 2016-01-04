var gulp = require('gulp'),
concat = require('gulp-concat');

gulp.task('js', function () {
	gulp.src(['ng/module.js', 'ng/**/*.js'])
	.pipe(concat('main.js'))
	.pipe(gulp.dest('public/javascripts'));

	// move javascript files to public folder
	gulp.src('javascripts/**/*.js')
	.pipe(gulp.dest('public/javascripts'));

});

gulp.task('watch:js', ['js'], function () {
	gulp.watch(['ng/**/*.js','javascripts/**/*.js'], ['js']);
});

