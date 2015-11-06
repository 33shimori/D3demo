angular.module('main')
.controller('mainCtrl', function ($scope, $interval){
	var time = new Date('2015-01-01T00:00:00' );

	// Random data point generator
	var randPoint = function () {
		var rand = Math.random;
		return  {time: new Date(time.toString()), visitors: rand()*100}
  }
	// we store a list of logs
	$scope.logs = [ randPoint()];
	$interval(function (){
		time.setSeconds(time.getSeconds() + 1);
		$scope.logs.push(randPoint());
  }, 1000);
});

