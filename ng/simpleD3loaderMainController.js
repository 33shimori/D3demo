angular.module('main').
	controller('simpleD3LoaderMainCtrl', function ($scope, simpleD3Loader, simpleHttpLoader,stringParser){
	var formatter =d3.time.format("%d/%b/%Y:%H:%M:%S %Z");
	$scope.log = {
		src:'files/access.log',
		data: ''
	};
	simpleHttpLoader($scope.log.src).then(function (response){
		// Response
		var responseDataStr = response.data;
		// Parse string to array of datum arrays
		var parsed = stringParser(responseDataStr);
		// Map each datum array to object
		var mapped = parsed.map(function(d){
			return {
				ip: d[0],
				time: formatter.parse(d[2]),
				request:d[3],
				status:d[4],
				agent: d[9]
			};
		});
		var grouped = d3.nest()
		.key(function (d){
			// Round to interval of 5 minutes
			var coeff = 1000 * 60 * 5;
			return Math.round(d.time / coeff) * coeff;
		})
		.entries(mapped);
		$scope.log.data=grouped;
	});


	/*
		 simpleD3loader($scope.log.src, function (data){
		 $scope.log.data = data;
		 $scope.$digest();
		 });
		 */
});


