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


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .25);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#aec7e8", "#ff9896"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format("%"));

var svg = d3.select("p").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("spreadsheets/side_by_side.csv", function(error, data) {
  if (error) throw error;

  var prevNames = d3.keys(data[0]).filter(function(key) { return key !== "Year"; });

  data.forEach(function(d) {
    d.prevs = prevNames.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.Year; }));
  x1.domain(prevNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.prevs, function(d) { return d.value; }); })]);

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

  var year = svg.selectAll(".year")
      .data(data)
    .enter().append("g")
      .attr("class", "year")
      .attr("transform", function(d) { return "translate(" + x0(d.Year) + ",0)"; });

  year.selectAll("rect")
      .data(function(d) { return d.prevs; })
    .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .style("fill", function(d) { return color(d.name); });

  var legend = svg.selectAll(".legend")
      .data(prevNames.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 1000)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 1004)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});