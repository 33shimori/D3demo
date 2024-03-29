var ampersand = "M 72.184621,99.39089 C 68.398038,95.61996 48.405425,73.700329 50.716835,49.985704 C 52.990823,26.655017 76.884556,12.578576 98.97427,11.448114 C 119.34404,10.405671 142.83345,16.156173 152.28457,35.843184 C 162.40413,56.922579 150.99532,81.842705 134.24772,94.48352 C 128.42088,98.881524 127.0609,99.082849 118.46055,102.84216 C 106.06795,108.25911 93.590914,113.54803 80.869078,118.1294 C 54.582831,127.59557 34.539139,149.03858 35.259701,178.23878 C 35.916374,204.84994 59.631137,225.67546 85.210802,229.70364 C 112.43115,233.99018 134.41358,229.54707 153.1347,208.67628 C 161.17912,199.70814 177.58763,184.99294 185.76751,176.14503 C 200.25035,160.47941 207.7442,147.82465 213.06419,126.69158 C 216.66826,112.37483 192.54569,115.67347 196.78314,103.62942 C 222.23036,100.69638 247.81229,99.84462 273.34564,97.96536 C 277.34887,109.81154 263.97786,106.33066 246.61613,121.01207 C 227.0104,137.59107 217.88679,151.73768 201.01195,170.86236 L 189.11358,184.34708 C 181.10521,193.42317 167.95634,207.85044 159.78314,216.77784 C 142.32024,235.85217 126.21297,247.41796 100.27427,252.39343 C 72.543606,257.71262 39.651129,254.69839 20.122962,231.94973 C -0.62641014,207.77846 -4.0848351,167.90434 18.462826,143.66847 C 33.171306,127.85873 41.031184,120.17885 60.724466,112.09432 C 76.147466,105.76283 100.05575,99.431353 112.29677,94.160526 C 139.69178,82.364582 140.40896,53.478721 127.50818,32.380115 C 116.44184,14.281646 83.908653,15.752833 77.904904,37.000557 C 72.689417,55.458561 80.089538,67.982449 91.37226,80.93907 L 187.58994,191.43156 C 199.42503,205.63979 217.24414,228.88851 237.39579,232.51125 C 250.72342,234.90721 267.9319,228.93995 277.27793,220.4821 C 282.25334,229.49138 275.03265,236.84049 269.43939,242.49659 C 251.14471,260.99681 219.58458,257.23653 199.30993,242.48439 C 187.00911,233.53413 178.95611,227.18492 167.95716,215.15746 L 72.184621,99.39089 z ";


var svg = d3.select("body").append("svg")
.attr("with", "300")
.attr("height", "300");

var path = svg.append("svg:path")
.attr("d", ampersand)
.style("stroke-width", 2)
.style("stroke", "steelblue")
.style("fill", "none");

// get the name of an object type in javascript
Object.prototype.getName = function() {
	var funcNameRegex = /function (.{1,})\(/;
	var results = (funcNameRegex).exec((this).constructor.toString());
	return (results && results.length>1)? results[1] : "";
};

// remove duplicates from javascript array
function uniq(a){
	var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];
	return a.filter (function (item){
		var type = typeof item;
		if(type in prims)
			return prims[type].hasOwnProperty(item)? false : (prims[type][item] = true);
		else
			return objs.indexOf(item) >= 0 ? false: objs.push(item);
  });
};

var pathEl = path.node();
var intersections = [];
// Kevin Lindsey's library
var shape1 = new Path(pathEl);
var overlays = Intersection.intersectShapes(shape1, shape1);
for (i in overlays.points){
	if (overlays.points[i].getName().includes("Point2D")){
		intersections.push(overlays.points[i]);
  }
}
// The pass will record 2 points for each intersection, so deduping is necessary
var dedupe_intersections = uniq(intersections);
var circles = svg.selectAll('circle')
.data(dedupe_intersections)
.enter()
.append('circle');
var circleAttributes = circles
.attr("cx", function (d) {return d.x; })
.attr("cy", function (d) {return d.y; })
.attr("r", "3")
.attr("fill", "red");
