class LineChart {

// constructor method to initialize StackedAreaChart object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;


        // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
        //console.log("AVG HOURS WORKED")
        //console.log(this.data)

        let colors = ["#1b70fc", "#fcc603", "#d50527", "#158940", "#f898fd", "#24c9d7",
            "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff",
            "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616"]

        this.colors = colors;

        this.colorScale = d3.scaleOrdinal()
            .domain([2003, 2020])
            .range(colors);

        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 30, right: 100, bottom: 50, left: 120};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height  - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.percentileScale = d3.scaleLinear()
            .range([0, 100])
            .domain([1, 16]);

        vis.x = d3.scaleLinear()
            .range([0, vis.width])
            .domain([-3, 103]);

        vis.y = d3.scaleLinear()
            .range([vis.height,0])
            .domain([35,50]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.lines = vis.svg.append("path")

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'dotTooltip')

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



        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);

        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", vis.width)
            .attr("y", vis.height - 6)
            .attr("font-size", "10px")
            .text("income percentile (from 0 to 100)");

        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", vis.x(100) - 10)
            .attr("y", vis.height + 32)
            .attr("font-size", "10px")
            .attr("font-style", "italic")
            .text("highest earners");

        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", vis.x(50))
            .attr("y", vis.height + 32)
            .attr("font-size", "10px")
            .attr("font-style", "italic")
            .text("middle earners");

        vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "beginning")
            .attr("x", vis.x(0) + 10)
            .attr("y", vis.height + 32)
            .attr("font-size", "10px")
            .attr("font-style", "italic")
            .text("lowest earners");

        vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -35)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .attr("font-size", "10px")
            .text("avg. hours worked per week");

        let grouped_data = d3.group(vis.data, d => d.YEAR);

        console.log(grouped_data)

        let myColor = d3.scaleOrdinal()
            .domain(grouped_data.keys())
            .range(vis.colors);

        let line = d3.line()
            .x(d => vis.x(vis.percentileScale(d.FAMINCOME)) )
            .y(d => vis.y(d.avgHours) )
            .curve(d3.curveLinear);

        vis.svg.selectAll('.line')
            .data(grouped_data)
            .enter()
            .append('path')
            .attr('fill', 'none')
            .attr('stroke', d => myColor(d[0]))
            .attr('stroke-width', function(d) {
                if (d[0] == highlightYear) {
                    return 5;
                } else {
                    return 0.5;
                }
            })
            .attr('d', (d) => line(Array.from(d.values())[1]))
            .on("mouseover", function(e, d) {
                // show selection of arc
                d3.select(this)
                    .attr('stroke-width', 5)
                // display info with tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", e.pageX + 20 + "px")
                    .style("top", e.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 2px; background: white; padding: 5px">
                             <h5>Year: ${d[0]}</h5></p>                         
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
                return vis.x(vis.percentileScale(d.FAMINCOME)); } )
            .attr("cy", function (d) {
                return vis.y(d.avgHours); } )
            .attr("r", 1.5)
            .style("fill", d=> myColor(d.YEAR))

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
                             <h5>Year: ${d.YEAR}</h5>
                             <h6> Income Percentile: ${Number(vis.percentileScale(d.FAMINCOME)).toFixed(0)} out of 100</h6>
                             <h6> Average Hours Worked: ${Number(d.avgHours).toFixed(0)}</h6>                         
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