var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('dev:server', function () {
	nodemon({
		script: '',
		env: {'DEBUG': 'D3demo:*', 'NODE_ENV':'development'},
		ext: 'js sass jade',
		ignore: ['public*', 'test*','gulp*']
  })
});



