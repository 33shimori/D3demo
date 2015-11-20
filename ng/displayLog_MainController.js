angular.module('main').
	controller('displaylogCtrl', function ($scope, d3, simpleHttpLoader, stringParser, classifier){
	// Formats date strings  22/Nov/2014:01:56:00 +0100
	var formatter = d3.time.format("%d/%b/%Y:%H:%M:%S %Z");

$scope.startDate = '2015-11-18T12:00:00';
$scope.endDate = '2015-11-19T18:00:00';

	$scope.log = {
		// Soruce of the log file
		src: 'files/access.log',
		// Data entries
		data: [],
		// Maps response array to readable JSON Object
		map: function (d) {
			return {
				time: formatter.parse(d[2]),
				ip: d[0],
				request: d[3],
				status: d[4],
				agent : d[9]
      };
    },
		// Group the z-values in an interval of x minutes
		groupByMinutes: 5
  };
// Load the source file
simpleHttpLoader($scope.log.src).then(function (response){
	// Concat all responses to string
	var responseDataStr = response.data;
	// Parse string to an array of datum arrays
	var parsed = stringParser(responseDataStr);
	// Map each datum array to object
	var mapped = parsed.map($scope.log.map);
	// Group the dataset by time
	var grouped = classifier(mapped, function (d){
		var coeff = 1000 * 60 * $scope.log.groupByMinutes;
		return Math.round(d.time / coeff) * coeff;
  });
	// Use the grouped data for the chart
	//console.log(new Date(Number(grouped[0].time)));
	$scope.log.data = grouped;
});

});
