function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
  var legendWidth  = 200,
      legendHeight = 100;

  var axes = svg.append('g')
    .attr('clip-path', 'url(#axes-clip)');

  axes.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(xAxis);

  axes.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Prevalence');

  var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 0)');

  legend.append('rect')
    .attr('class', 'female')
    .attr('width',  75)
    .attr('height', 20)
    .attr('x', 10)
    .attr('y', 10);

  legend.append('text')
    .attr('x', 115)
    .attr('y', 25)
    .text('Women Interval');

  legend.append('rect')
    .attr('class', 'male')
    .attr('width',  75)
    .attr('height', 20)
    .attr('x', 10)
    .attr('y', 40);

  legend.append('text')
    .attr('x', 115)
    .attr('y', 55)
    .text('Men Interval');

  legend.append('path')
    .attr('class', 'w')
    .attr('d', 'M10,80L85,80');

  legend.append('text')
    .attr('x', 115)
    .attr('y', 85)
    .text('Women');
	
	legend.append('path')
    .attr('class', 'm')
    .attr('d', 'M10,110L85,110');

  legend.append('text')
    .attr('x', 115)
    .attr('y', 115)
    .text('Men');
}

function drawPaths (svg, data, x, y) {
  var upperMen = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.Year) || 1; })
    .y0(function (d) { return y(d.Men_Upper); })
    .y1(function (d) { return y(d.Men); });

  var menLine = d3.svg.line()
    .interpolate('basis')
    .x(function (d) { return x(d.Year); })
    .y(function (d) { return y(d.Men); });

  var lowerMen = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.Year) || 1; })
    .y0(function (d) { return y(d.Men); })
    .y1(function (d) { return y(d.Men_Lower); });
	
	var upperWomen = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.Year) || 1; })
    .y0(function (d) { return y(d.Women_Upper); })
    .y1(function (d) { return y(d.Women); });
	
	 var womenLine = d3.svg.line()
    .interpolate('basis')
    .x(function (d) { return x(d.Year); })
    .y(function (d) { return y(d.Women); });
	
	 var lowerWomen = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.Year) || 1; })
    .y0(function (d) { return y(d.Women); })
    .y1(function (d) { return y(d.Women_Lower); });

  svg.datum(data);

  svg.append('path')
    .attr('class', 'area upper female')
    .attr('d', upperWomen)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
    .attr('class', 'area lower female')
    .attr('d', lowerWomen)
    .attr('clip-path', 'url(#rect-clip)');
  
    svg.append('path')
    .attr('class', 'w')
    .attr('d', womenLine)
    .attr('clip-path', 'url(#rect-clip)');
  
  svg.append('path')
    .attr('class', 'area upper male')
    .attr('d', upperMen)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
    .attr('class', 'area lower male')
    .attr('d', lowerMen)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
    .attr('class', 'm')
    .attr('d', menLine)
    .attr('clip-path', 'url(#rect-clip)');
}

function startTransitions (svg, chartWidth, chartHeight, rectClip, x) {
  rectClip.transition()
    .duration(1000*4)
    .attr('width', chartWidth);
}

function makeChart (data) {
  var svgWidth  = 960,
      svgHeight = 500,
      margin = { top: 20, right: 20, bottom: 40, left: 40 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var x = d3.time.scale().range([0, chartWidth])
            .domain(d3.extent(data, function (d) { return d.Year; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([0, 0.15]);

  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left').tickFormat(d3.format("%"))
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

  var svg = d3.select('p').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);

  addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
  drawPaths(svg, data, x, y);
  startTransitions(svg, chartWidth, chartHeight, rectClip, x);
}
var parseDate  = d3.time.format('%Y').parse;
d3.csv("spreadsheets/side_by_side_bounds.csv", function (error, rawData) {
  if (error) {
    console.error(error);
    return;
  }

  var data = rawData.map(function (d) {
    return {
      Year:  parseDate(d.Year),
	  Men: d.Men,
	  Women: d.Women,
	  Men_Upper: d.Men_Upper,
      Men_Lower: d.Men_Lower,
      Women_Upper: d.Women_Upper,
	  Women_Lower: d.Women_Lower      
    };
  });


  makeChart(data);

});