class LineChartRate {

// constructor method to initialize StackedAreaChart object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        let colors = ["#191970", "#38678f", "red", "#568ebd", "#8ca9cf"];

        this.colors = colors;

        this.colorScale = d3.scaleOrdinal()
            .domain(["Black", "Hispanic", "US", "Asian", "White"])
            .range(colors);

        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 10, right: 20, bottom: 20, left: 45};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height  - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right + 50)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // padding for axis
        vis.padding = 10;

        var maxDate = "2021-04-02";

        var minDate = "2020-01-01";

        // Scales and axes

        vis.x = d3.scaleTime()
            .range([0, vis.width])
            .domain([Date.parse(minDate), Date.parse(maxDate)]);

        vis.y = d3.scaleLinear()
            .range([vis.height,0])
            .domain([0, 0.2]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d3.timeFormat("%b %Y"))
            .ticks(8);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
            .tickFormat(formatPercent);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.lines = vis.svg.append("path")

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'dotTooltip')

        // Legend
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width - 15}, ${vis.height - 50})`)

        vis.legend.selectAll().data(vis.colors)
            .enter()
            .append('text')
            .attr('width', 20)
            .attr('height', 10)
            .attr('x', 20)
            .attr('y', -56)
            .attr("font-size", "15px")
            .text("Legend")

        vis.legend.selectAll().data(vis.colors)
            .enter()
            .append('rect')
            .attr('width', 20)
            .attr('height', 10)
            .attr('x', d => 20)
            .attr('y', (d,i) => i * 12 - 50)
            .attr('fill', d => d)

        vis.legend.selectAll().data(vis.colors)
            .enter()
            .append('text')
            .attr('width', 20)
            .attr('height', 10)
            .attr('x', 45)
            .attr('y', -42)
            .attr("font-size", "10px")
            .text("Black")

        vis.legend.selectAll().data(vis.colors)
            .enter()
            .append('text')
            .attr('width', 20)
            .attr('height', 10)
            .attr('x', 45)
            .attr('y', -30)
            .attr("font-size", "10px")
            .text("Hispanic")

        vis.legend.selectAll().data(vis.colors)
            .enter()
            .append('text')
            .attr('width', 20)
            .attr('height', 10)
            .attr('x', 45)
            .attr('y', -18)
            .attr("font-size", "10px")
            .text("All")

        vis.legend.selectAll().data(vis.colors)
            .enter()
            .append('text')
            .attr('width', 20)
            .attr('height', 10)
            .attr('x', 45)
            .attr('y', -6)
            .attr("font-size", "10px")
            .text("Asian")

        vis.legend.selectAll().data(vis.colors)
            .enter()
            .append('text')
            .attr('width', 20)
            .attr('height', 10)
            .attr('x', 45)
            .attr('y', 6)
            .attr("font-size", "10px")
            .text("White")


        // TO-DO: (Filter, aggregate, modify data)
        vis.wrangleData();

    }

    /*
     * Data wrangling
     */
    wrangleData(){
        let vis = this;

        // Update the visualization
        vis.updateVis();
    }

    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     * Function parameters only needed if different kinds of updates are needed
     */
    updateVis(){
        let vis = this;

        // Call axis functions
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);


        vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -43)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .attr("font-size", "10px")
            .text("Unemployment Rate");

        let grouped_data = d3.group(vis.data, d => d.RACE);

        console.log("Group:", grouped_data);

        let myColor = d3.scaleOrdinal()
            .domain(grouped_data.keys())
            .range(vis.colors);

        let line = d3.line()
            .x(d => vis.x(Date.parse((d.MONTH))) )
            .y(d => vis.y(Number(d.PERCENT)/100.0))
            .curve(d3.curveLinear);

        vis.svg.selectAll('.line')
            .data(grouped_data)
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', d => myColor(d[0]))
            .attr('stroke-width', function(d) {
                if (d[2] == USAvgGuess && myColor(d[0]) == 'red') {
                    return 5;
                } else {
                    return 0.5;
                }
            })
            .attr('d', (d) => line(Array.from(d.values())[1]))
            .on("mouseover", function(e, d) {
                // show selection of arc
                d3.select(this)
                    .attr('stroke-width', function(d) {
                        if ((d[2] == USAvgGuess && myColor(d[0]) == 'red')) {
                            return 0.5;
                        } else {
                            return 5;
                        }
                    })
                // display info with tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", e.pageX + 20 + "px")
                    .style("top", e.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 2px; background: white; padding: 5px">
                             <h5>Demographic: ${d[0]}</h5></p>
                         </div>`);
            })
            .on('mouseout', function(e, d) {
                d3.select(this)
                    .attr('stroke-width', 0.5)
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

        vis.svg.append('g')
            .selectAll("dot")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return vis.x(Date.parse((d.MONTH))); } )
            .attr("cy", function (d) {
                return vis.y(Number(d.PERCENT)/100.0); } )
            .attr("r", 1.5)
            .style("fill", d=> myColor(d.RACE))

            .on("mouseover", function(e, d) {
                // show selection of arc
                d3.select(this)
                    .attr('fill', 'black')
                    .attr('r', 5)

                // display info with tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", e.pageX + 20 + "px")
                    .style("top", e.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 2px; background: white; padding: 5px">
                             <h5>${d.RACE}</h5>
                             <h6> Month: ${(formatDate(Date.parse(d.MONTH)))}</h6>
                             <h6> Percent Unemployed: ${Number(d.PERCENT).toFixed(1)}</h6>
                         </div>`);
            })

            .on('mouseout', function(e, d) {
                d3.select(this)
                    .attr("fill", d => myColor(2003))
                    .attr('r', 1.5)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })


    }
}