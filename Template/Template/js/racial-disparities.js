
// SVG drawing area

let margin = {top: 5, right: 5, bottom: 5, left: 5};

let width = 400 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

let svg = d3.select("#chart-area-disparities").append("svg")
    .attr("width", width + margin.left + margin.right + 20)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Date parser
let formatDate = d3.timeFormat("%b %Y");
let parseDate = d3.timeParse("%Y");

// padding for axis
var padding = 10;

var dateScale = d3.scaleTime()
    .range([padding, width - padding]);


var percentScale = d3.scaleLinear()
    .range([height - padding, padding]);

// creating axes
// x-axis
var xAxis = d3.axisBottom()
    .scale(dateScale)
    .tickFormat(d3.timeFormat("%b %Y"))
    .ticks(6);

// Draw the x-axis
var XAxisGroup = svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + (height) + ")")

var formatPercent = d3.format(".0%");

var formatDataPercent = d3.format("r");

// y-axis
var yAxis = d3.axisLeft()
    .scale(percentScale)
    .tickFormat(formatPercent);

// Draw the y-axis
var YAxisGroup = svg.append("g")
    .attr("class", "axis y-axis")


// // Line function
// var linegraph = svg.append("path")
//     .attr("class", "line");
//
// console.log("Scale: " + percentScale(data.BLACK));
//
// var line = d3.line()
//     .x(d => {return dateScale(formatDate(d.MONTH));})
//     .y(d => {return percentScale(d.BLACK);})
//     .curve(d3.curveLinear);



// // Chart data
// var chartOptions = [];
// chartOptions["GOALS"] = "Goals";
// chartOptions["AVERAGE_GOALS"] = "Average Goals";
// chartOptions["MATCHES"] = "Matches";
// chartOptions["TEAMS"] = "Teams";
// chartOptions["AVERAGE_ATTENDANCE"] = "Average Attendance";
//
// // Select Box
// for (var i in chartOptions) {
//     d3.select("#chart-option").append("option")
//         .attr("value", i)
//         .text(chartOptions[i]);
// }
//
// var selectedOption = "GOALS";


// Initialize data
loadData();

// FIFA world cup
let data;

const timeParse = d3.timeParse("%Y-%m-%d");
// Load CSV file
function loadData() {
    d3.csv("data/racial-disparities.csv", row => {
        row.MONTH = timeParse(row.MONTH)        ;
        row.BLACK = +row.BLACK;
        row.HISPANIC = +row.HISPANIC;
        row.US = +row.US;
        row.ASIAN = +row.ASIAN;
        row.WHITE = +row.WHITE;
        return row
    }).then(csv => {

        // Store csv data in global variable
        data = csv;

        // Draw the visualization for the first time
        updateVisualization();
    });
}


// Render visualization
function updateVisualization() {

    console.log(data);

    var maxDate = d3.max(data, d => {
        return d.MONTH;
    })
    var minDate = d3.min(data, d => {
        return d.MONTH;
    })

    // x-axis
    dateScale.domain([minDate, maxDate]);

    // y-axis
    percentScale.domain([0, 1]);

    // // update line graph!
    // linegraph.transition()
    //     .attr("d", line(data))
    //     .duration(800);

    // // data points
    // var circles = svg.selectAll(".tooltip-circle")
    //     .data(data, d => {return d.MONTH});
    //
    // // Exit
    // circles.exit().remove();
    //
    // // Enter (initialize the newly added elements)
    // let circlesEnter = circles.enter().append("circle")
    //     .attr("class", "tooltip-circle")
    //
    // // Enter and Update (set the dynamic properties of the elements)
    // circles.merge(circlesEnter)
    //     .on("click", (e,d) => showEdition(d))
    //     .transition()
    //     .duration(800)
    //     .attr("cx", d=> dateScale(d.MONTH))
    //     .attr("cy", d=> percentScale(d[selectedOption]))
    //     .attr("r", 4);
    //
    // circlesEnter.exit().remove();

    // Draw Axes
    xAxisGroup = svg.select(".x-axis")
        .attr("transform", "translate(20," + (height - padding - 10) + ")")
        .call(xAxis);

    yAxisGroup = svg.select(".y-axis")
        .attr("transform", "translate(" + (width - padding - 350) + ", -10)")
        .call(yAxis);

    // Line function
    var linegraph = svg.append("path")
        .attr("class", "line");

    console.log("Scale: " + data[0].BLACK);
    console.log("Data cale: " + percentScale(data[0].BLACK));
    console.log("Percent: " + formatDataPercent(data[0].BLACK));

    console.log("Date: " + formatDate(data[0].MONTH));
    var line = d3.line()
        .x(d => {
            if (isNaN(d)) {
                console.log("NaN:" + d.MONTH);
            }

            console.log(formatDate(d.MONTH));
            return formatDate(d.MONTH);})
        .y(d => {
            console.log(formatDataPercent(d.BLACK));
            return formatDataPercent(d.BLACK);})
        .curve(d3.curveLinear);

    linegraph.attr("d", line(data))
        .attr("stroke", "black");

//     const area = d3.area()
//         .x(d => dateScale(d.MONTH))
//         .y1(d => percentScale(d.BLACK))
//         .y0(percentScale(0));
//
// // Add the area
//     svg.append("path")
//         .datum(data)
//         .attr("fill", "#cce5df")
//         .attr("stroke", "#69b3a2")
//         .attr("stroke-width", 1.5)
//         .attr("class", "area")
//         .attr("d", area);

}
