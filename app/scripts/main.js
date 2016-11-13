// var accidents = require('./accidents.json');
var margin = { top: 100, right: 50, bottom: 80, left: 50 },
    width = 980 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var ticks = 150;
// var initial = true;
var activities = [
    ["2016-01-01T00:00:00Z", "Accident Policy now available"],
    ["2016-01-15T00:00:00Z", "New Product Offering Splash"],
    ["2016-02-25T00:00:00Z", ""],
    ["2016-02-29T00:00:00Z", "10% Discount on Premiums"],
    ["2016-06-01T00:00:00Z", "Free Spouse Coverage for 1 year"],
    ["2016-06-15T00:00:00Z", ""],
    ["2016-06-30T00:00:00Z", "Free Financial Consulting"]
];

var colors = ['line', 'line2', 'line3', 'line4'];

var x, y;

var lines = [];


var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ"),
    bisectDate = d3.bisector(function(d) {
        return d.time;
    }).left;

svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Accident Policy Sales");

svg.append("text")
    .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top - 40) + ")")
    .style("text-anchor", "middle")
    .text("Date");


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


function jsonHandler(error, data) {
    if (error)
        throw error;

    data = data.map(function(d) {
        return parseTime(d);
    })

    x = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(data, function(d) {
            return d; }));

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


    y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(lineData, function(d) {
            return d.count;
        })]);

    var line = d3.line()
        .x(function(d) {
            return x(d.time);
        })
        .y(function(d) {
            return y(d.count);
        });


    svg.append("path")
        .datum(lineData)
        .attr("class", "line")
        .attr("id", "line")
        .attr("d", line);

    if (ticks > 180) {
        d3.select("#line").style('stroke-width', '2');
    } else {
        d3.select("#line").style('stroke-width', '3');
    }



    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("id", "yAxis");

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .attr("id", "xAxis");

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        // .on("mouseover", function() {
        //     focus.style("display", null);
        //     div.transition()
        //         .duration(200)
        //         .style("opacity", .9);
        // })
        // .on("mouseout", function() {
        //     focus.style("display", "none");
        //     div.transition()
        //         .duration(500)
        //         .style("opacity", 0);
        // })
        // .on("mousemove", mousemove);

    var i = 0;
    activities.forEach(function(date) {
        svg.append("line")
            .attr("class", "divided")
            .attr("x1", x(parseTime(date[0]).getTime()))
            .attr("y1", 0)
            .attr("x2", x(parseTime(date[0]).getTime()))
            .attr("y2", height)
            .style("stroke-width", 2)
            .style("stroke-dasharray", ("3, 5"))
            .style("stroke", "#989898")
            .style("fill", "none")


        svg.append("text")
            .attr("class", "divider_label")
            .style("font-size", 12)
            // .style("letter-spacing", 1)
            // .style("font-weight", 500)
            .attr("transform", "translate(" + x(parseTime(date[0]).getTime()) + ", " + i + "), rotate(-35)")
            .text(date[1]);

        i += 5;

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

}


function handleFile(filename, lineName) {
    // d3.select("#test").remove();

    if ((insurance_plan + insurance_coverage + promo_codes) === 'AllAllAll')
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

        var lineData = bins.filter(function(bin) {
            return bin.length > 0;
        }).map(function(bin) {
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
                return x(d.time);
            })
            .y(function(d) {
                return y(d.count);
            });



        var select = svg.append("path")
            .datum(lineData)
            .attr("class", lineName)
            .attr("d", line)
            .attr("id", "test");

        if (ticks > 180) {
            d3.selectAll("#test").style('stroke-width', '2');
        } else {
            d3.selectAll("#test").style('stroke-width', '3');
        }

        if (lines.length >= 3) {
            var i = lines.shift();
            console.log(i);
            i.remove();
        }
        lines.push(select);

    })

}


var insurance_plan = "All";
var insurance_coverage = "All";
var promo_codes = "All";

$('#plan > .button').on('click', function(e) {
    $('#plan > #' + insurance_plan).css('opacity', '0.3');
    insurance_plan = $(this).attr('id');
    $('#plan > #' + insurance_plan).css('opacity', '1');

    handleFile('scripts/' + insurance_plan + insurance_coverage + promo_codes + '.json', colors[Math.floor(4 * Math.random())]);
})

$('#coverage > .button').on('click', function() {
    $('#coverage > #' + insurance_coverage).css('opacity', '0.3');
    insurance_coverage = $(this).attr('id');
    $('#coverage > #' + insurance_coverage).css('opacity', '1');

    handleFile('scripts/' + insurance_plan + insurance_coverage + promo_codes + '.json', colors[Math.floor(4 * Math.random())]);
})


$('#codes > .button').on('click', function() {
    $('#codes > #' + promo_codes).css('opacity', '0.3');
    promo_codes = $(this).attr('id');
    $('#codes > #' + promo_codes).css('opacity', '1');

    handleFile('scripts/' + insurance_plan + insurance_coverage + promo_codes + '.json', colors[Math.floor(4 * Math.random())]);
})


var rangeSlider = function() {
    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');

    slider.each(function() {

        value.each(function() {
            var value = $(this).prev().attr('value');
            $(this).html(value);
        });

        range.on('input', function() {
            $(this).next(value).html(this.value);

            setTick(this.value);
        });
    });
};

rangeSlider();

function setTick(val) {
    ticks = parseInt(val);

    d3.selectAll("#line").remove();
    d3.selectAll(".divided").remove();
    d3.selectAll(".divider_label").remove();
    d3.selectAll(".axis").remove();
    d3.selectAll("#test").remove();
    d3.queue()
        .defer(d3.json, 'scripts/AllAllAll.json')
        .await(jsonHandler);

    handleFile('scripts/' + insurance_plan + insurance_coverage + promo_codes + '.json', secondary_color);
}

window.requestAnimationFrame = window.requestAnimationFrame || 
                               window.mozRequestAnimationFrame || 
                               window.webkitRequestAnimationFrame || 
                               window.msRequestAnimationFrame;

function grow() {
    var i = 1;
    $('.bar').each(function(index, value) {
        var percent = $(this).attr('data-percent');
        var timing = percent / 150;
        setTimeout(function() {

            $(value).css('max-width', +percent + '%').css('transition', timing + 's ease all');
            $(value).append('<div class="num">' + percent + '%</div>');

        }, i * 50);

        i++;
    });
}



$(document).ready(function() {
    requestAnimationFrame(grow);
});
