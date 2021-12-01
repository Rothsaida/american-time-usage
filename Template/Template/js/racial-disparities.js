
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


// Initialize data
loadData();

let data;

const timeParse = d3.timeParse("%Y-%m-%d");
// Load CSV file
function loadData() {
    d3.csv("data/racial-disparities.csv", row => {
        row.MONTH = timeParse(row.MONTH)        ;
        row.BLACK = +row.BLACK/100.0;
        row.HISPANIC = +row.HISPANIC/100.0;
        row.US = +row.US/100.0;
        row.ASIAN = +row.ASIAN/100.0;
        row.WHITE = +row.WHITE/100.0;
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
    percentScale.domain([0, 0.2]);

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

    // Black Demographic
    // Line function
    var linegraphB = svg.append("path")
        .attr("class", "line");

    var lineBlack = d3.line()
        .x(d => {
            return dateScale(d.MONTH);})
        .y(d => {
            return percentScale(d.BLACK);})
        .curve(d3.curveLinear);

    linegraphB.attr("d", lineBlack(data))
        .style("fill", "none")
        .attr("stroke", "#191970")
        .attr("transform", "translate(" + 20 + "," + -12 + ")");

    // Hispanic Demographic
    var linegraphH = svg.append("path")
        .attr("class", "line");

    console.log("Date: " + formatDate(data[0].MONTH));
    var lineHispanic = d3.line()
        .x(d => {
            return dateScale(d.MONTH);})
        .y(d => {
            return percentScale(d.HISPANIC);})
        .curve(d3.curveLinear);

    linegraphH.attr("d", lineHispanic(data))
        .style("fill", "none")
        .attr("stroke", "#38678f")
        .attr("transform", "translate(" + 20 + "," + -12 + ")");

    // Asian Demographic
    var linegraphA = svg.append("path")
        .attr("class", "line");

    console.log("Date: " + formatDate(data[0].MONTH));
    var lineAsian = d3.line()
        .x(d => {
            return dateScale(d.MONTH);})
        .y(d => {
            return percentScale(d.ASIAN);})
        .curve(d3.curveLinear);

    linegraphA.attr("d", lineAsian(data))
        .style("fill", "none")
        .attr("stroke", "#568ebd")
        .attr("transform", "translate(" + 20 + "," + -12 + ")");

    // White Demographic
    var linegraphW = svg.append("path")
        .attr("class", "line");

    console.log("Date: " + formatDate(data[0].MONTH));
    var lineWhite = d3.line()
        .x(d => {
            return dateScale(d.MONTH);})
        .y(d => {
            return percentScale(d.WHITE);})
        .curve(d3.curveLinear);

    linegraphW.attr("d", lineWhite(data))
        .style("fill", "none")
        .attr("stroke", "#8ca9cf")
        .attr("transform", "translate(" + 20 + "," + -12 + ")");

    // Hispanic Demographic
    var linegraphUS = svg.append("path")
        .attr("class", "line");

    console.log("Date: " + formatDate(data[0].MONTH));
    var lineUS = d3.line()
        .x(d => {
            return dateScale(d.MONTH);})
        .y(d => {
            return percentScale(d.US);})
        .curve(d3.curveLinear);

    linegraphUS.attr("d", lineUS(data))
        .style("fill", "none")
        .attr("stroke", "red")
        .attr("transform", "translate(" + 20 + "," + -12 + ")");

    // Tooltip - All demographics
    // create group element for line and text , focus display, none
    // vertical line
    let focus = svg.append("g")
        .attr("class", "BlackTooltip")
        .style("display", "none");

    focus.append("line")
        .attr("stroke", "black")
        .attr("x1", 30)
        .attr("y1", height)
        .attr("x2", 30)
        .attr("y2", 0);

    focus.append("text")
        .attr("class", "tool-date")
        .attr("x", 10)
        .attr("y", 10)
        .text("tooltip date value");

    focus.append("text")
        .attr("class", "tool-BlackPercent")
        .attr("x", 10)
        .attr("y", 25)
        .text("tooltip percent value");

    focus.append("text")
        .attr("class", "tool-HispanicPercent")
        .attr("x", 10)
        .attr("y", 40)
        .text("tooltip percent value");

    focus.append("text")
        .attr("class", "tool-AsianPercent")
        .attr("x", 10)
        .attr("y", 55)
        .text("tooltip percent value");

    focus.append("text")
        .attr("class", "tool-WhitePercent")
        .attr("x", 10)
        .attr("y", 70)
        .text("tooltip percent value");

    // has mouse movements
    svg.append("rect")
        .attr("width", width + 20)
        .attr("height", height - padding - 10)
        .attr("transform", "translate(" + 30 + ",0)")
        .attr("class", "rectangleOverlay")
        .attr("opacity", "0")
        .on("mouseover", () => focus.style("display", null))
        .on("mouseout", () => focus.style("display", "none"))
        .on("mousemove", mousemove);

    // define the mousemove function here

    function mousemove(event) {

        let bisectDate = d3.bisector(d=>d.MONTH).left;
        const formatTime = d3.timeFormat("%B %Y");
        const formatTool = d3.format(",.0f");

        var x_pos = d3.pointer(event)[0];
        console.log(x_pos);

        var x_date = dateScale.invert(x_pos);
        console.log(x_date);

        let index = bisectDate(data, x_date);

        console.log("Data: ", data);
        let data_element = data[index]
        //console.log("Element: ", data_element);

        focus.attr("transform", "translate(" + x_pos + 20 + ",0)");


        d3.select(".tool-date")
            .text(formatTime(data_element.MONTH));

        d3.select(".tool-BlackPercent")
            .text("Black: " + (data_element.BLACK * 100).toFixed(1) + "%");

        d3.select(".tool-HispanicPercent")
            .text("Hispanic: " + (data_element.HISPANIC * 100).toFixed(1) + "%");

        d3.select(".tool-AsianPercent")
            .text("Asian: " + (data_element.ASIAN * 100).toFixed(1) + "%");

        d3.select(".tool-WhitePercent")
            .text("White: " + (data_element.WHITE * 100).toFixed(1) + "%");
    }


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
