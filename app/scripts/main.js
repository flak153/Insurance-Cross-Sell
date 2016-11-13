// var accidents = require('./accidents.json');
var margin = { top: 70, right: 50, bottom: 30, left: 50 },
    width = 980 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var ticks = 150;
var activities = [
  ["2016-01-01T00:00:00Z", "Accident Policy now available"], 
  ["2016-01-15T00:00:00Z", "New Product Offering Splash"], 
  ["2016-02-25T00:00:00Z", "10% Discount on Premiums"], 
  ["2016-02-29T00:00:00Z", "10% Discount on Premiums"], 
  ["2016-06-01T00:00:00Z", "Free spouse coverage for 1 year"], 
  ["2016-06-15T00:00:00Z", "Free spouse coverage for 1 year"], 
  ["2016-06-30T00:00:00Z", "Free Financial Consulting"]];

var x = d3.scaleTime()
    .range([0, width])
    .domain([1420088400000, 1477886400000]);
    // .domain([d3.min(data, function(d) {
    //     return d.getTime() }), d3.max(data, function(d) {
    //     return d.getTime() })]);
var y = d3.scaleLinear()
    .domain([0, 583])
    .range([height, 0]);
    // .domain([0, d3.max(lineData, function(d) {
    //     return d.count; })])

var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ"),
    bisectDate = d3.bisector(function(d) {
        return d.time; }).left;


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");

focus.append("circle")
    .attr("r", 4.5)
    .style("z-index", "100");

d3.queue()
    .defer(d3.json, 'scripts/AllAllAll.json')
    .await(jsonHandler);

function jsonHandler(error, data, Premium) {
    if (error)
        throw error;

    data = data.map(function(d) {
        return parseTime(d);
    })
    

    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(ticks))
        (data);

    var lineData = bins.map(function(bin) {
        return {
            count: bin.length,
            time: bin.reduce(function(a, b) {
                var val = (a.getTime() + b.getTime()) / 2;
                var copy = new Date();
                copy.setTime(val);
                return copy;
            })
        }
    })

    var line = d3.line()
        .x(function(d) {
            return x(d.time); })
        .y(function(d) {
            return y(d.count); });

    svg.append("path")
        .datum(lineData)
        .attr("class", "line")
        .attr("d", line);

    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        // .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em");

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() {
            focus.style("display", null);
            div.transition()
                .duration(200)
                .style("opacity", .9);
        })
        .on("mouseout", function() {
            focus.style("display", "none");
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("mousemove", mousemove);

      var i = 0;
      activities.forEach(function(date) {
        svg.append("line")
          .attr("class", "divided")
          .attr("x1", x(parseTime(date[0]).getTime()))  
          .attr("y1", 0)
          .attr("x2", x(parseTime(date[0]).getTime()))  
          .attr("y2", height)
          .style("stroke-width", 1)
          .style("stroke-dasharray", ("3, 5"))
          .style("stroke", "#989898")
          .style("fill", "none")

        // svg.append("text")
        //   .style("font-size", "12")
        //   .attr("y", i)
        //   .attr("transform", "translate(" + x(parseTime(date[0]).getTime()) + "," + y(0) + ")")
        //   .attr("dy", "0.71em")
        //   .attr("text-anchor", "start")
        //   .text(date[1]);
        
        if (i === 0)
          i = height;
        else 
          i = 0;

      })
     
    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(lineData, x0, 1),
            d0 = lineData[i - 1],
            d1 = lineData[i],
            d = x0 - d0 > d1 - x0 ? d1 : d0;

        var date = (d.time.getMonth() + 1) + '/' + d.time.getDate() + '/' + d.time.getFullYear();
        focus.attr("transform", "translate(" + x(d.time) + "," + y(d.count) + ")");

        div.html("Count: <span class='hi'>" + d.count + "</span><br>" + "Time: <span class='hi'>" + date + "</span>")
            .style("left", x(d.time) + "px")
            .style("top", (y(d.count)) + "px");
    }

    // handleFile('scripts/AllAllFINCON.json', 'line2');
    // handleFile('scripts/AllAllFREESPOUSE.json', 'line3');
    // handleFile('scripts/AllAllACCOFF10.json', 'line4');
}


function handleFile(filename, lineName) {
    d3.select("#test").remove();

    if ( (insurance_plan + insurance_coverage + promo_codes) === 'AllAllAll')
      return;


    d3.json(filename, function(err, data) {
        if (err)
          throw err;

      data = data.map(function(d) {
        return parseTime(d);
      })

      var bins = d3.histogram()
          .domain(x.domain())
          .thresholds(x.ticks(ticks))
          (data);

      var lineData = bins.map(function(bin) {
          return {
              count: bin.length,
              time: bin.reduce(function(a, b) {
                  var val = (a.getTime() + b.getTime()) / 2;
                  var copy = new Date();
                  copy.setTime(val);
                  return copy;
              })
          }
      })

      var line = d3.line()
          .x(function(d) {
              return x(d.time); })
          .y(function(d) {
              return y(d.count); });

      svg.append("path")
          .datum(lineData)
          .attr("class", lineName)
          .attr("d", line)
          .attr("id", "test");

    })
    
}


var insurance_plan = "All";
var insurance_coverage = "All";
var promo_codes = "All";

$('#plan > .button').on('click', function(e) {
  $('#plan > #' + insurance_plan).css('opacity', '0.3');
  insurance_plan = $(this).attr('id');
  $('#plan > #' + insurance_plan).css('opacity', '1');
  
  handleFile('scripts/' + insurance_plan + insurance_coverage + promo_codes + '.json', 'line2');
})

$('#coverage > .button').on('click', function() {
  $('#coverage > #' + insurance_coverage).css('opacity', '0.3');
  insurance_coverage = $(this).attr('id');
  $('#coverage > #' + insurance_coverage).css('opacity', '1');
  handleFile('scripts/' + insurance_plan + insurance_coverage + promo_codes + '.json', 'line3');
})


$('#codes > .button').on('click', function() {
  $('#codes > #' + promo_codes).css('opacity', '0.3');
  promo_codes = $(this).attr('id');
  $('#codes > #' + promo_codes).css('opacity', '1');
  handleFile('scripts/' + insurance_plan + insurance_coverage + promo_codes + '.json', 'line4');
})




