/* ----------------------------------------------------------------------------
File: MultiLine.js
Contructs the MultiLine Chart  using D3
80 characters perline, avoid tabs. Indet at 4 spaces. See google style guide on
JavaScript if needed.
-----------------------------------------------------------------------------*/ 

// Search "D3 Margin Convention" on Google to understand margins.
var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Refrence and 
look up SVG AXIS and SCALES. See D3 API Refrence to understand the 
difference between Ordinal vs Linear scale.
----------------------------------------------------------------------*/ 
var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

// Define X and Y AXIS
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
    

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.income); });



// Define SVG. "g" means group SVG elements together.
// Confused about SVG still, see Chapter 3. 
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("id", "visualization")
    .attr("xmlns", "http://www.w3.org/2000/svg");

    
/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 


d3.tsv("EPC_2000_2010_new.tsv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

	data.forEach(function(d) {
    d.year = parseDate(d.year);
  });
	
var countries = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {year: d.year, income: +d[name]};
      })
    };
  });

x.domain(d3.extent(data, function(d) { return d.year; }));

  y.domain([
    d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.income; }); }),
    d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.income; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(0)")
      .attr("dx", "-.8em")
      .attr("dy", ".25em")
      .style("text-anchor", "end")
      .attr("font-size", "10px");
     
      
	  

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .style("text-anchor", "end")
      .text("Million BTUs per person");
 
  var country = svg.selectAll(".country")
      .data(countries)
      .enter().append("g")
      .attr("class", "country");
	

  country.append("path")
      .attr("class", "line")
      .transition().duration(5000)
      .delay(function(d,i) { return i* 200;})
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); })
      .attr("stroke-dashoffset", 0);
  
	country.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.income) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
 
});
  
   

