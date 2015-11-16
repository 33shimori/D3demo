module.exports = function (config){
	config.set({
		frameworks: ['mocha', 'chai', 'sinon-chai'],
		files: [
			'public/angular/angular.js',
			'public/angular-mocks/angular-mocks.js',
			'public/d3/d3.js',
			'ng/**/module.js',
			'ng/**/*.js',
			{pattern: 'test/ng/access.log', included: false},
			'test/ng/**/simpled3loader.spec.js'
    ],
		reporters: ['progress'],
		port: 9876,
		loglevel: config.Log_INFO,
		autoWatch: true,
		browsers: ['PhantomJS'],
		singleRun: false
  });
};

