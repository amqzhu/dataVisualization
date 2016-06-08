/*
'use strict';
d3.csv("spreadsheets/side_by_side.csv", getData, display);

function getData(d) {
	return {
		Country : d.Country,
		ISO: d.ISO,
		Sex: d.Sex,
		Year: +d.Year,
		Prevalence: +d.Prevalence,
		Lower: +d.Lower,
		Upper: +d.Upper
	};
}

function display(data) {
	console.log(data);
}
*/

function makeChart(st, input) {
	var n = 2, // number of layers
    m = 35, // number of samples per layer
    stack = st,
	layers = input,
    yGroupMax = 0.17,
    yStackMax = 0.17;
	console.log(layers);
	var margin = {top: 40, right: 10, bottom: 20, left: 10},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(d3.range(1980, 2015))
    .rangeRoundBands([0, width], .25);

var y = d3.scale.linear()
    .domain([0, yStackMax])
    .range([height, 0]);

var color = d3.scale.linear()
    .domain([0, n - 1])
    .range(["#aec7e8", "#ff9896"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .tickPadding(6)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right")
	.tickFormat(d3.format("%"));

var svg = d3.select("p").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var layer = svg.selectAll(".layer")
    .data(layers)
  .enter().append("g")
    .attr("class", "layer")
    .style("fill", function(d, i) { return color(i); });

var rect = layer.selectAll("rect")
    .data(function(d) { return d; })
  .enter().append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", height)
    .attr("width", x.rangeBand())
    .attr("height", 0);

rect.transition()
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); });

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
      .attr("class", "y axis")
	  .attr("transform", "translate(-17, 0)")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 45)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Prevalence");
	  
var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + (width - 1000) + ', 0)');

  legend.append('rect')
    .attr('class', 'female')
    .attr('width',  75)
    .attr('height', 20)
    .attr('x', 10)
    .attr('y', 10)
	.style("fill", "#ff9896");

  legend.append('text')
    .attr('x', 115)
    .attr('y', 25)
    .text('Women');

  legend.append('rect')
    .attr('class', 'male')
    .attr('width',  75)
    .attr('height', 20)
    .attr('x', 10)
    .attr('y', 40)
	.style("fill", "#aec7e8");

  legend.append('text')
    .attr('x', 115)
    .attr('y', 55)
    .text('Men');
	  
d3.selectAll("input").on("change", change);

var timeout = setTimeout(function() {
  d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
}, 2000);

function change() {
  clearTimeout(timeout);
  if (this.value === "grouped") transitionGrouped();
  else transitionStacked();
}

function transitionGrouped() {
  y.domain([0, yGroupMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d, i, j) { return x(d.x) + x.rangeBand() / n * j; })
      .attr("width", x.rangeBand() / n)
    .transition()
      .attr("y", function(d) { return y(d.y); })
      .attr("height", function(d) { return height - y(d.y); });
}

function transitionStacked() {
  y.domain([0, yStackMax]);

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d.y0 + d.y); })
      .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .transition()
      .attr("x", function(d) { return x(d.x); })
      .attr("width", x.rangeBand());
}
}


// Inspired by Lee Byron's test data generator.
function bumpLayer(n) {
  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = Math.random();
  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

d3.csv("spreadsheets/side_by_side.csv", function (error, rawData) {
  if (error) {
    console.error(error);
    return;
  }

  var data = rawData.map(function (d) {
    return [{
      x:  +d.Year,
	  y: +d.Men,
	  y0: 0
    }, {
	  x:  +d.Year,
	  y: +d.Women,
	  y0: +d.Men
	}];
  });
  
  var arr = createArray(2, 35);
  var i, j;
  for (j = 0; j < 2; j++) {
	  for (i = 0; i < 35; ++i) {
		arr[j][i] = data[i][j];
  }
  }
  
  console.log(data);
  console.log(arr);
  stack = d3.layout.stack();
//  var dat = stack(d3.range(2).map(function() { return bumpLayer(35); }));
//	console.log(d3.range(2).map(function() { return bumpLayer(35); }));
makeChart(stack, arr);
  
});