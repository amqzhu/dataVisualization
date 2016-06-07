/*
'use strict';
d3.csv("NCD_RisC_Lancet_2016_DM_age_standardised_world.csv", getData, display);

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


var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

	var color = d3.scale.ordinal()
    .range(["#1f77b4", "#d62728", "#2ca02c", "#ffbb78"]);
//var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
	.tickFormat(d3.format("%"));

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.percentage); });

var svg = d3.select("p").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("spreadsheets/diabetes_adiposity.csv", function(error, data) {
  if (error) throw error;

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

  data.forEach(function(d) {
    d.Year = parseDate(d.Year);
  });

  var percs = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {Year: d.Year, percentage: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.Year; }));

  y.domain([
    0,
    d3.max(percs, function(c) { return d3.max(c.values, function(v) { return v.percentage; }); })
  ]);
  
  
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Prevalence");

  var per = svg.selectAll(".per")
      .data(percs)
    .enter().append("g")
      .attr("class", "per");

  per.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

	var legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 600)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 604)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
});