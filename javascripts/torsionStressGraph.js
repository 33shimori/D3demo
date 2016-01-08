'use strict';

var height = 550, width = 550;
var svg = d3.select('body').append('svg')
	.attr('width', width)
	.attr('height', height)
	.attr('viewbox', '0 0 ' + width + ' ' + height);

var svg_disp = svg.append('g').attr('class', 'disp')
var svg_data = svg_disp.append('g').attr('class', 'data');
var svg_size = svg_disp.append('g').attr('class', 'size');
var svg_axis = svg_disp.append('g').attr('class', 'axis');

var svg_x_axis = svg_axis.append('g').attr('class', 'x-axis');
var svg_y_axis = svg_axis.append('g').attr('class', 'y-axis');

var margin = {top: 20, right: 20, bottom: 20, left: 45};

var data=[
	[{x:0.1, y:1450}, {x:0.3, y: 1400}, {x:0.6, y: 1350},
		{x: 1.0, y: 1295 },{x: 3.0, y: 1100}, {x: 7.0, y: 900}]
];

var size = [
	[{x: 0.5, y: 0}, {x: 0.5, y: 2200}]
];

var xScale = d3.scale.log()
.domain([0.1, 10])
.range([margin.left, width-margin.right]);

var yScale = d3.scale.linear()
.domain([700, 2200])
.range([height - margin.bottom, margin.top]);

// axis lines
var x_axis = d3.svg.axis()
.scale(xScale)
.orient('bottom')
.ticks(12, '0.1f');

var axis_x_height = height - margin.bottom;
svg_x_axis
.attr("transform", "translate(0," + axis_x_height + ")")
.call(x_axis);

var y_axis = d3.svg.axis()
.scale(yScale)
.orient('left')
.ticks(14);

svg_y_axis
.attr("transform", "translate(" + margin.left + ")")
.call(y_axis);

// stress line

var line = d3.svg.line()
.x(function(d){ return xScale(d.x); })
.y(function(d){ return yScale(d.y); })
.interpolate('basis');

svg.select('.data')
.selectAll('path')
.data(data)
.enter()
.append('path')
.attr('class', 'data')

svg.select('.data')
.selectAll('path')
.data(data)
.attr('d', line)
.style('fill', 'none')
.style('stroke', '#00f')
.style('stroke-width', '1px');

// target wire size line

var sizeline = d3.svg.line()
.x(function (d){ return xScale(d.x); })
.y(function (d){ return yScale(d.y); })
.interpolate('linear');

svg.select('.size')
.selectAll('path')
.data(size)
.enter()
.append('path')
.attr('class', 'size');

svg.select('.size').selectAll('path')
.data(size)
.attr('d', sizeline)
.style('fill', 'none')
.style('stroke', 'steelblue')
.style('stroke.width', '1px');

svg.select('.size').selectAll('path')
.data(size)
.exit()
.remove();

// get the name of an object type in javascript
Object.prototype.getName = function (){
	var funcNameRegex = /function (.{1,})\/(/;
	var resutls = (funcNameRegex).exec((this).constructor.toString());
	return (results & results.length > 1)? results[1]: "";
};

var pathdata = svg.select('.data').selectAll('path').node();
var pathsize = svg.select('.size').selectAll('path').node();
var intersections = [];
// Keveb Lindsey's Library
var shape1 = new Path(pathdata);
var shape2 = new Path(pathsize);
var overlays = Intersection.intersectShapes(shape1, shape2);

for (i in overlays.points) {
	if(overlays.points[i].getName().includes('Point2D')){
		intersections.push(overlays.points[i]);
  }
}

svg.select('.data').selectAll('circle')
.data(intersections)
.enter()
.append('circle');

svg.select('.data').selectAll('circle')
.data(intersections)
.attr('r', '3')
.attr('cx', function(d) { return d.x; })
.attr('cy', function(d) { return d.y; })
.style('fill', 'red');

svg.select('.data').selectAll('circle')
.data(intersections)
.exit()
.remove();


