angular.module('main').
factory ('d3',function () {
	/* We could delare locals or other D3.js
	 * specific configurations here. */

return d3;
});

angular.module('main').
	factory('classifier', function () {
	return function (data, key){
		return d3.nest()
		.key(key)
		.entries(data)
		.map(function (d){
			return {
			time: d.key,
				visitors: d.values.length
			};
		});
	};
});

// Parser service
angular.module('main').
	factory('stringParser', function(){
	return function(str, line, word, rem){
		line = line || "\n";
		word = word || /[-"]/gi;
		rem = rem || /["\[\]]/gi;

		return str.trim().split(line).map(function(l){
			return l.split(word).map(function(w){
				return w.trim().replace(rem,'');
      });
    });
  };
})

angular.module('main').
	factory('simpleD3Loader', function (d3){
		return function (url, callback){
			d3.text(url, 'text/plan', callback);
    };
});

angular.module('main').
	factory('simpleHttpLoader', function ($http){
	return function (url){
		return $http.get(url);
  };
});

angular.module('main').
	filter('gte_date', function (){
	return function (input, raw_date){
		var date = new Date(raw_date);
		return isNaN(date.getTime())? input : input.filter(function (d){
			return new Date(Number(d.time)) >= date;
    });
  };
});

angular.module('main').
	filter('lte_date', function (){
	return function (input, raw_date){
		var date = new Date(raw_date);
		return isNaN(date.getTime())? input : input.filter(function(d){
			return new Date(Number(d.time)) <= date;
    });
  };
});


angular.module('main').
	directive('myScatterChart', function (d3){//{{{

	function draw (svg, width, height, data){
		svg
		.attr('width', width)
		.attr('height', height);

		// Define a margin
		var margin = 30;
		// Define x-scale
		var xScale = d3.time.scale()
		.domain(
			d3.extent(data,function (d) { return d.x; })
    )
		.range([margin, width-margin]);
		// Define x-axis
		var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('top')
		.tickFormat(d3.time.format('%H:%M'));

		// Define y-scale
		var yScale = d3.scale.linear()
		.domain([0, d3.max(data, function (d){ return d.y; })
		])
		.range([margin, height-margin]);
		//Define y-axis
		var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')
		.tickFormat(d3.format('f'));

		// Draw x-axis
		svg.select('.x-axis')
		.attr("transform", "translate(0, "+ margin + ")")
		.call(xAxis);
		// Draw y-axis
		svg.select('.y-axis')
		.attr("transform", "translate(" + margin + ")")
		.call(yAxis);
		// Add new the data points
		svg.select('.data')
		.selectAll('circle').data(data)
		.enter()
		.append('circle');
		// Update all data points
		svg.select('.data')
		.selectAll('circle').data(data)
		.attr('r', 2.5)
		.attr('cx', function(d){  return xScale(d.x); })
		.attr('cy', function(d){  return yScale(d.y);});
  }

	return {
		restrict: "E",
		scope: {
			data: "="
    },
		compile: function (element, attrs, transclude){

			// Create a SVG root element
			var svg = d3.select(element[0]).append('svg');

			svg.append('g').attr('class', 'data');
			svg.append('g').attr('class', 'x-axis axis');
			svg.append('g').attr('class', 'y-axis axis');


			// Define the dimensions for the chart
			var width = 600, height = 300;

			// Return the link function
		return function (scope, element, attrs){

		 // Watch the data attribute of the scope
	 scope.$watch('data', function (newVal, oldVal, scope){
		 // Map the data to internal format
		 var data = scope.data.map(function (d){
			 return{
				 x: d.time,
				 y: d.visitors
       }
     });

		 // Update the chart
		 draw(svg, width, height, data);
   }, true);
		};
    }
  };
});//}}}

angular.module('main').
	directive('myLineChart', function (d3, $filter){//{{{

	function draw (svg, width, height, data){
		if (data && !data.length){
			return;
    }

		svg
		.attr('width', width)
		.attr('height', height);

		// Define a margin
		var margin = 30;
		// Define x-scale
		var xScale = d3.time.scale()
		.domain(
			d3.extent(data,function (d) { return d.x; })
    )
		.range([margin, width-margin]);
		// Define x-axis
		var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.tickFormat(d3.time.format('%I:%M'));

		// Define x-grid  refactor Draw the x-grid
		var xGrid = d3.svg.axis()
		.scale(xScale)
		.orient('buttom')
		.tickSize(height - 2*margin, 0,0)
		.tickFormat("");

		// Draw the x-grid (NEW)
		svg.select('.x-grid')
		.attr("transform", "translate(0, "+ margin + ")")
		.call(xGrid);

	// Define y-scale
		var yScale = d3.time.scale()
		.domain([0, d3.max(data, function (d){ return d.y; })
		])
		.range([height-margin, margin]);// reverse order

		//Define y-axis
		var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')
		.tickFormat(d3.format('f'));

			// Draw the y grid (New)
		svg.select('.y-grid')
		.attr("transform", "translate(" + margin + ")")
		.call(yAxis
				 .tickSize(-width + 2*margin, 0,0 )
				 .tickFormat("")
		);

		// Draw x-axis
		svg.select('.x-axis')
		.attr("transform", "translate(0, "+ (height - margin) + ")")// changed
		.call(xAxis);

		// Draw y-axis
		svg.select('.y-axis')
		.attr("transform", "translate(" + margin + ")")
		.call(yAxis);

		var easing = d3.ease('cubic');
		var ease_type = 'cubic';
		var max = d3.max(data, function (d){ return d.y; });
		var duration = 2500;
		/*
		var interpolatePoints = function (A,B){

			var interpolator_x = d3.interpolateArray(
			A.map(function(d) { return d.x; }),
			B.map(function(d) { return d.x; })
      );
			var interpolator_y = d3.interpolateArray(
				A.map(function(d){ return d.y; }),
				B.map(function(d){ return d.y; })
      );

			return function (t){
				var x = interpolator_x(t);
				var y = interpolator_y(t);

				return x.map(function (d,i){
					return {
						x: x[i],
						y: y[i]
          };
        });
      };
    };
		*/

		// Add new the data points
		svg.select('.data')
		.selectAll('circle').data(data)
		.enter()
		.append('circle')
		.attr('class', 'data-point');

		// Update all data points
		svg.select('.data')
		.selectAll('circle').data(data)
		.attr('r', 2.5)
		.attr('cx', function(d){  return xScale(d.x); })
		.attr('cy', function(d){  return yScale(0);})
		.transition()
		.ease(ease_type)
		.duration(duration)
		.attr('cy', function (d) { return yScale(d.y); });

		svg.select('.data')
		.selectAll('circle').data(data)
		.exit()
		.remove();

		// Draw a line
		var line0 = d3.svg.line()
		.x(function(d) { return xScale(d.x); })
		.y(function(d) { return yScale(d.y); })
		.interpolate('cardinal').tension(0.95);

		var line1 = d3.svg.line()
		.x(function(d) { return xScale(d.x); })
		.y(function(d) { return yScale(d.y); })
		.interpolate('cardinal').tension(0.95);

		svg.select(".data-line")
		.datum(data)
		.attr("d", line0)
		.transition()
		.ease(ease_type)
		.duration(duration)
		.attr("d", line1);

		// Draw a area
		var area0 = d3.svg.area()
		.x(function (d){ return xScale(d.x); })
		.y0(yScale(0))
		.y1(function (d) { return yScale(d.y); })
		.interpolate('cardinal').tension(0.95);

		var area1 = d3.svg.area()
		.x(function (d){ return xScale(d.x); })
		.y0(yScale(0))
		.y1(function (d) { return yScale(d.y); })
		.interpolate('cardinal').tension(0.95);

		svg.select(".data-area")
		.datum(data)
		.attr("d", area0)
		.transition()
		.ease(ease_type)
		.duration(duration)
	/*	.attrTween("d", function () {
			var min = d3.min(data, function (d){ return d.y; });
			var start = data.map(function (d){
				return {
					x: d.x,
					y: min
        };
      });
			return function (t){
				var interpolate = interpolatePoints(start, data);
				return area(interpolate(t));
      };
    });*/
	 .attr("d", area1);

	/* cursor */

	var xCursor = svg.select('.x-cursor');
	var yCursor = svg.select('.y-cursor');
	var activePoint = svg.select('.data-point-active');

	var xLabel = svg.select('.x-label');
	var yLabel = svg.select('.y-label');
	var labelDuration =10;

	svg.on('mousemove', function() {

		var pos = d3.mouse(this);
		var xValue = xScale.invert(pos[0]);
		var xBisect = d3.bisector(function (d) { return d.x; }).left;
		var index = xBisect(data, xValue);

		var hMargin = -8;
		var vMargin = 3;
		var xMin = d3.min(data, function (d) { return d.x; });
		var xMax = d3.max(data, function (d) { return d.x; });
		var yMax = d3.max(data, function (d) { return d.y; });

		if (index ===0 || index >= data.length){
			return;
    }

		// get the nearest value
		var d0 = data[index -1];
		var d1 = data[index];

		var d = xValue -d0.x < d1.x - xValue? d1: d0;

		if (d === undefined || !d.hasOwnProperty('x') || !d.hasOwnProperty('y')){
			return;
    }
		activePoint
			.attr("cx", xScale(d.x))
			.attr("cy", yScale(d.y))
			.attr("r", 3);

		xCursor
			.attr("x1", xScale(d.x))
			.attr("y1", yScale(0))
			.attr("x2", xScale(d.x))
			.attr("y2", yScale(yMax));
		yCursor
			.attr("x1", xScale(xMin))
			.attr("y1", yScale(d.y))
			.attr("x2", xScale(xMax))
			.attr("y2", yScale(d.y));
	var xLeft = xScale(d.x) + vMargin;
	var xTop = yScale(0);
	var date = new Date(Number(d.x));
	var format = d3.time.format("%I:%M");

		xLabel
			.transition()
			.ease(easing)
			.duration(labelDuration)
			.attr("transform", "translate(" + xLeft + "," + xTop + ") rotate(-90)");
		xLabel
			.select('text')
			.text(format(date));
		xLabel
			.select('path')
			.style('display', 'block');

	var yLeft = xScale(xMin);
	var yTop = yScale(d.y) +hMargin;

		yLabel
			.transition()
			.ease(easing)
			.duration(labelDuration)
			.attr("transform", "translate(" + yLeft + "," + yTop + ")");
		yLabel
			.select('text')
			.text(d3.format('f')(d.y))
		yLabel
			.select('path')
			.style('display', 'block');

  });
	/*   ZOOM    */
	var zoomDuration = 150;
	var zoom = d3.behavior.zoom()
		.x(xScale)
		.on("zoom", function (){

		// Update x-Axis
		svg.select('.x-axis')
		.transition()
		.ease(ease_type)
		.duration(zoomDuration)
		.call(xAxis);

		svg.select('.x-grid')
		.transition()
		.ease(ease_type)
		.duration(zoomDuration)
		.call(xGrid);

		// Update date points
		svg.select('.data')
		.selectAll('circle').data(data)
		.transition()
		.ease(ease_type)
		.duration(zoomDuration)
		.attr('d', line1)
		.attr('cx', function (d) { return xScale(d.x); })
		.attr('cy', function (d) { return yScale(d.y); });

		svg.select(".data-line")
		.transition()
		.ease(ease_type)
		.duration(zoomDuration)
		.attr("d", line1);

		svg.select(".data-area")
		.transition()
		.ease(ease_type)
		.duration(zoomDuration)
		.attr("d", area1);
    });
		svg.call(zoom);
    }

		function filter (data, minDate, maxDate){
			// Create a new array
			var d = data.slice(0);
			if(minDate !== undefined){
				d = $filter('gte_date')(d, minDate);
      }
			if(maxDate !== undefined){
				d = $filter('lte_date')(d, maxDate);
      }
			return d;
    };

	return {
		restrict: "E",
		scope: {
			data: "=",
			startDate: "=",
			endDate: "="
    },
		compile: function (element, attrs, transclude){

			// Create a SVG root element
			var svg = d3.select(element[0]).append('svg');

			// Create container
			var visCont = svg.append('g').attr('class', 'vis');
			var axis_container = visCont.append('g').attr('class', 'axis');
			var data_container = visCont.append('g').attr('class', 'data');
			var focusCont = visCont.append('g').attr('class', 'focus');
			var cursorCont = visCont.append('g').attr('class', 'cursor');

			axis_container.append('g').attr('class', 'x-grid grid');
			axis_container.append('g').attr('class', 'y-grid grid');

			axis_container.append('g').attr('class', 'x-axis axis');
			axis_container.append('g').attr('class', 'y-axis axis');

			data_container.append('path').attr('class', 'data-line');
			data_container.append('path').attr('class', 'data-area');

			cursorCont.append('line').attr('class', 'x-cursor cursor');
			cursorCont.append('line').attr('class', 'y-cursor cursor');

			focusCont.append('circle').attr('class', 'data-point-active');

			var xLabelNode = focusCont.append('g').attr('class', 'x-label label');
			var yLabelNode = focusCont.append('g').attr('class', 'y-label label');

			// Path for the label shape
			var tag_path = 'M 51.166,23.963 62.359,17.5 c 1.43,-0.824 1.43,-2.175 0,-3 L 51.166,8.037 48.568,1.537 2,1.46993227 2,30.576466 48.568,30.463 z';

			xLabelNode.append('path')
				.style('display', 'none')
				.attr('d', tag_path)
				.attr('transform', 'translate(-30,-15) scale(0.7)');
			xLabelNode.append('text')
				.attr('transform', 'translate(-20)');

			yLabelNode.append('path')
				.style('display', 'none')
				.attr('d', tag_path)
				.attr('transform', 'translate(-30,-15) scale(0.7)');
			yLabelNode.append('text')
				.attr('trasnform', 'translate(-20)');


			// Define the dimensions for the chart
			var width = 800, height = 300;

			// Return the link function
		return function (scope, element, attrs){


		 // Watch the data attribute of the scope
	 scope.$watch('[data,startDate, endDate]', function (newVal, oldVal, scope){
		 // Update the chart
		 if(scope.data){
		 var data = filter(scope.data, scope.startDate, scope.endDate);

		 // Map the data to internal format
			data = data.map(function (d){
			 return{
				 x: d.time,
				 y: d.visitors
       }
     });

		 draw(svg, width, height, data);
		 }
   }, true);
		};
    }
  };
});//}}}

angular.module('main').
	directive('myBarChart', function (d3){//{{{

	// initialize the 'cursorchange' event
	var dispatch = d3.dispatch("cursorchange");


	function draw (svg, width, height, data){
		svg
		.attr('width', width)
		.attr('height', height);

		// Define a margin
		var margin = 30;
		// Define x-scale
		var xScale = d3.time.scale()
		.domain(
			d3.extent(data,function (d) { return d.x; })
    )
		.range([margin, width-margin]);
		// Define x-axis
		var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.tickFormat(d3.time.format('%I:%M'));

		// Define y-scale
		var yScale = d3.time.scale()
		.domain([0, d3.max(data, function (d){ return d.y; })
		])
		.range([height-margin, margin]);// reverse order
		//Define y-axis
		var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')
		.tickFormat(d3.format('f'));

		// Draw x-axis
		svg.select('.x-axis')
		.attr("transform", "translate(0, "+ (height - margin) + ")")// changed
		.call(xAxis);
		// Draw y-axis
		svg.select('.y-axis')
		.attr("transform", "translate(" + margin + ")")
		.call(yAxis);

		// Draw the x-grid (NEW)
		svg.select('.x-grid')
		.attr("transform", "translate(0, "+ margin + ")")
		.call(xAxis
				 .tickSize(height - 2*margin, 0,0 )
				 .tickFormat("")
		);
		// Draw the y grid (New)
		svg.select('.y-grid')
		.attr("transform", "translate(" + margin + ")")
		.call(yAxis
				 .tickSize(-width + 2*margin, 0 )
				 .tickFormat("")
		);

		// Draw bars
		var start = d3.min(data, function(d) { return d.x ;});
		var end = d3.max(data, function(d){ return d.x; });
		var barWidth = (width - 2*margin)*1000*60*5/(end - start );

		svg.select('.data')
		.selectAll('rect').data(data)
		.enter()
		.append('rect')
		.attr('class', 'data-bar');

		var easing = d3.ease('cubic');
		var ease_type = 'cubic';
		var max = d3.max(data, function (d){ return d.y; });
		var duration = 2500;

		// Update all data points
		svg.select('.data')
		.selectAll('rect').data(data)
		.attr('r', 2.5)
		.attr('x', function(d){  return xScale(d.x)- barWidth*0.5; })
		.attr('y', function(d){  return yScale(0);})
		.attr('width', function (d) { return barWidth; })
		.attr('height', 0)
		.transition()
		.duration(function (d,i) {return duration*(d.y/max); })
		.ease(ease_type)
		.delay(function (d,i){ return duration*easing((i+1)/data.length); })
		.attr('y', function(d){ return yScale(d.y); })
		.attr('height', function(d){ return yScale(0)- yScale(d.y); });

		svg.select('.data')
		.selectAll('rect').data(data)
		.exit()
		.remove();

		// ----- cursor ----

		var xCursor = svg.select('.x-cursor');
		var yCursor = svg.select('.y-cursor');
		var activePoint = svg.select('.data-point-active');
		var xLabel = svg.select('.x-label');
		var yLabel = svg.select('.y-label');

		svg.on('mousemove', function(){
			var pos = d3.mouse(this);

			var xValue = xScale.invert(pos[0]);
			var yValue = yScale.invert(pos[1]);
			var xMin = d3.min(data, function(d) { return d.x; });
			var xMax = d3.max(data, function(d) { return d.x; });
			var yMax = d3.max(data, function(d) { return d.y; });

			// Create a bisector with an accessor function
		// that traverse the array from left
		var xBisect = d3.bisector(function (d) { return d.x; }).left;
		// Apply the bisector
		var index = xBisect(data, xValue);
		if (index === 0 || index > data.length){
			return ;
    }
		var d0 = data [index -1];
		var d1 = data [index];
		// get the nearest value
		var d = xValue -d0.x >d1.x-xValue ? d1: d0;

		var xMargin = 3, yMargin = 3;
		var xLeft = xScale(d.x) + xMargin;
		var xTop = yScale(0);
		var labelDuration = 10;

		if (d===undefined || !d.hasOwnProperty('x') || !d.hasOwnProperty('y')){
			return;
    }
		activePoint
			.attr('cx', xScale(d.x))
			.attr('cy', yScale(d.y))
			.attr('r', 3);

		xLabel
			.transition()
			.ease(easing)
			.duration(labelDuration)
			.attr('transform', 'translate(' +xLeft+ ',' +xTop+') rotate(-90)');
		xLabel
			.select("text")
			.text(d3.time.format("%I:%M")(new Date(Number(d.x))));
		xLabel
			.select("path")
			.style('display', 'block');

		var yLeft = xScale(xMin);
		var yTop = yScale(d.y) + yMargin;

		yLabel
			.transition()
			.ease(easing)
			.attr('transform', 'translate(' + yLeft+ ',' +yTop+ ')');
		yLabel
			.select('text')
			.text(d3.format('f')(d.y));
		yLabel
			.select('path')
			.style('display', 'block');

	xCursor
			.attr('x1', xScale(d.x))
			.attr('y1', yScale(0))
			.attr('x2', xScale(d.x))
			.attr('y2', yScale(yMax));
//		xLabel
//			.attr('transform', 'translate(' +xScale(d.x)+ ',' +(yMax +  8)+') rotate(-90)')
//			.text(d3.time.format("%I:%M")(new Date(Number(d.x))));
		yCursor
			.attr('x1', xScale(xMin))
			.attr('y1', yScale(d.y))
			.attr('x2', xScale(xMax))
			.attr('y2', yScale(d.y));
//		yLabel
//			.attr('transform', 'translate(' + (xScale(xMin) - 8)+ ',' + pos[1] + ')')
//			.text(d3.format('f')(yValue));

		// dispatch all cursor change events
		dispatch.cursorchange([d.x, d.y]);


		var translateZ = [0,0];
		var scaleZ = 1;
		var zoom = d3.behavior.zoom()
		.on('zoom', function (){
			translateZ = d3.event.translate;
			scaleZ = d3.event.scale;
			svg.select('.vis')
			.attr("transform", "translate(" + translateZ + ")scale(" + scaleZ + ")");
    });
		svg.call(zoom);

    });

  }

	return {
		restrict: "E",
		scope: {
			data: "=",
			cursor: '='
    },
		compile: function (element, attrs, transclude){

			// Create a SVG root element
			var svg = d3.select(element[0]).append('svg');

			// Create container
			var vis_Cont = svg.append('g').attr('class', 'vis');
			var axis_container = vis_Cont.append('g').attr('class', 'axis');
			var data_container = vis_Cont.append('g').attr('class', 'data');

			axis_container.append('g').attr('class', 'x-grid grid');
			axis_container.append('g').attr('class', 'y-grid grid');

			axis_container.append('g').attr('class', 'x-axis axis');
			axis_container.append('g').attr('class', 'y-axis axis');

			data_container.append('path').attr('class', 'data-line');
			data_container.append('path').attr('class', 'data-area');

			var cursorCont = axis_container.append('g').attr('class', 'cursor');
			cursorCont.append('line').attr('class', 'x-cursor cursor');
			cursorCont.append('line').attr('class', 'y-cursor cursor');
			//cursorCont.append('text').attr('class', 'x-label label');
			//cursorCont.append('text').attr('class', 'y-label label');

			var focusCont = vis_Cont.append('g').attr('class', 'focus')
			focusCont.append('circle').attr('class', 'data-point-active');
			var xLabelNode = focusCont.append('g').attr('class', 'x-label label');
			var yLabelNode = focusCont.append('g').attr('class', 'y-label label');

			// Path for the label shape
			var tag_path = 'M 51.166,23.963 62.359,17.5 c 1.43,-0.824 1.43,-2.175 0,-3 L 51.166,8.037 48.568,1.537 2,1.46993227 2,30.576466 48.568,30.463 z';

			xLabelNode.append('path')
				.style('display', 'none')
				.attr('d', tag_path)
				.attr('transform', 'translate(-30,-15) scale(0.7)');
			xLabelNode.append('text')
				.attr('transform', 'translate(-20)');

			yLabelNode.append('path')
				.style('display', 'none')
				.attr('d', tag_path)
				.attr('transform', 'translate(-30,-15) scale(0.7)');
			yLabelNode.append('text')
				.attr('trasnform', 'translate(-20)');



			// Define the dimensions for the chart
			var width = 800, height = 300;

			// Return the link function
		return function (scope, element, attrs){

		 // Watch the data attribute of the scope
	 scope.$watch('data', function (newVal, oldVal, scope){
		 // Map the data to internal format
		 var data = scope.data.map(function (d){
			 return{
				 x: d.time,
				 y: d.visitors
       }
     });

		 // Update the chart
		 draw(svg, width, height, data);
   }, true);
	// Listen on cursor change
	dispatch.on ('cursorchange', function (cursor){
		if (cursor){
			scope.$apply(function (){
				scope.cursor = cursor;
      });
    }
  });
		};
    }
  };
})//}}}

angular.module('main').
	directive('myPieChart', function (d3){//{{{

	function draw (svg, width, height, data){
		svg
		.attr('width', width)
		.attr('height', height);

		// Define a margin
		var margin = 30;

		var sum = function (data, stop){
			return data.reduce(function(prev, d, i){
				if(stop === undefined || i <stop){
					return prev + d.y;
        }
				return prev;
      }, 0)
    }
	var colors = d3.scale.category10();
	var total = sum(data);

	var arc = d3.svg.arc()
	.innerRadius(40)
	.outerRadius(100)
	.startAngle(function(d,i){
		if(i){
			return sum(data, i)/total *2*Math.PI;
    }
		return 0;
  })
	.endAngle(function(d,i){
		return sum(data, i+1)/total *2* Math.PI;
  });


		// Add new the data points
		svg.select(".data")
		.attr("transform", "translate(" + (width * 0.5)+ "," + (height*0.5)+ ")")
		.selectAll("path")
		.data(data)
		.enter().append("path")
		.attr("d", arc)
		.style("fill", "none")
		.style("stroke", function (d,i){ return colors(i); });

		svg.select(".label")
		.attr("transform", "translate(" +(width*0.5)+"," +(height*0.5)+")")
		.selectAll("path")
		.data(data)
		.enter().append("text")
		.attr("text-anchor", "middle")
		.attr("transform", function (d,i){ return "translate(" + arc.centroid(d,i)
     + ")"; })
		.text(function (d){
			var format = d3.time.format("%I:%M");
			return format(new Date(Number(d.x))); });
  }

	return {
		restrict: "E",
		scope: {
			data: "="
    },
		compile: function (element, attrs, transclude){

			// Create a SVG root element
			var svg = d3.select(element[0]).append('svg');

			// Create container
			var label_container = svg.append('g').attr('class', 'label');
			var data_container = svg.append('g').attr('class', 'data');



			// Define the dimensions for the chart
			var width = 800, height = 300;

			// Return the link function
		return function (scope, element, attrs){

		 // Watch the data attribute of the scope
	 scope.$watch('data', function (newVal, oldVal, scope){
		 // Map the data to internal format
		 var data = scope.data.map(function (d){
			 return{
				 x: d.time,
				 y: d.visitors
       }
     });

		 // Update the chart
		 draw(svg, width, height, data);
   }, true);
		};
    }
  };
})//}}}

// Brush Chart Directive
angular.module('main').
	directive('myBrushChart', function (d3){//{{{
	function draw(svg,width, height, data, dispatch){
		if(data && !data.length){
			return;
    }
		svg
			.attr('width', width)
			.attr('height', height);

		// define margin
		var margin = 10;

		// Define x scale
		var xScale = d3.time.scale()
		.domain(d3.extent(data, function (d) { return d.x; }))
		.range ([margin, width - margin]);

		// Define y scale
		var yScale = d3.time.scale()
		.domain([0, d3.max(data, function (d) { return d.y; })])
		.range ([height-margin, margin]);

		var easing = d3.ease('cubic');
		var ease_type = 'cubic';
		var max = d3.max(data, function (d){ return d.y });
		var duration = 2500;

		// Draw a line
		var line0 = d3.svg.line()
		.x(function (d) { return xScale(d.x)})
		.y(function (d) { return yScale(0)})
		.interpolate('cardinal');

		var line1 = d3.svg.line()
		.x(function (d){ return xScale(d.x); })
		.y(function (d){ return yScale(d.y); })
		.interpolate('cardinal');

		svg.select("data-line")
		.datum(data)
		.attr("d", line0)
		.transition()
		.ease(ease_type)
		.duration(duration)
		.attr("d", line1);

		// Draw a area
		var area0 = d3.svg.area()
		.x(function(d){ return xScale(d.x); })
		.y0(yScale(0))
		.y1(function(d) { return yScale(0); })
		.interpolate('cardinal');

		var area1 = d3.svg.area()
		.x(function(d){ return xScale(d.x); })
		.y0(yScale(0))
		.y1(function(d) {return yScale(d.y); })
		.interpolate('cardinal');

		svg.select(".data-area")
		.datum(data)
		.attr("d", area0)
		.transition()
		.ease(ease_type)
		.duration(duration)
		.attr("d", area1);

		var brush =d3.svg.brush()
		.x(xScale)
		.on('brushstart', function(){
			dispatch.brushstart(brush);
    })
		.on('brush', function(){
			dispatch.brush(brush);
    })
		.on('brushend', function(){
			dispatch.brushend(brush);
    });
		svg.select('.brush')
		.call(brush)
			.selectAll('rect')
			.attr('y', 0)
			.attr('height', height-margin);

  }

	return {
		restrict: 'E',
		scope: {
			data: "=",
			brush: "="
    },
		compile: function (element, attrs, transclude){
			// Create a SVG root element
			var svg = d3.select(element[0]).append('svg');

			//  Create container
			var visCont = svg.append('g').attr('class', 'svg');
			var dataCont = visCont.append('g').attr('class', 'data');
			var brushCont = visCont.append('g').attr('class', 'brush');

			dataCont.append('path').attr('class', 'data-line');
			dataCont.append('path').attr('class', 'data-area');

			// Initialize the brush events
			var dispatch = d3.dispatch(
				"brushstart", "brush", "brushend"
      );

			// Define the dimensinos for the chart
			var width = 200, height = 50;

			// Return the link function
			return function (scope, element, attrs){

				dispatch.on('brush', function (brush){
					scope.$apply(function (){
						scope.brush = brush.extent();
					});
				});
				// Watch the data attribute of the scope
				scope.$watch('data', function(newVal, oldVal, scope){

					// Map the data to internal format
					var data = scope.data.map(function (d){
						return{
							x: d.time,
							y: d.visitors
						}
					});

					// Update the chart
					if (scope.data){
						draw(svg, width, height, data, dispatch);
					}
				}, true);
      };
    }
  };
});//}}}
