var gulp = require('gulp'),
fs = require('fs'),
path = require('path');

fs.readdirSync(path.join(__dirname, 'gulp')).forEach(function (task){
	require(path.join(__dirname, 'gulp', task));
});

gulp.task('dev', ['watch:js', 'dev:server', ]);
gulp.task('build', ['js']);

