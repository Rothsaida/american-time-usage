class LineChart {

// constructor method to initialize StackedAreaChart object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;


        // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
        console.log("AVG HOURS WORKED")
        console.log(this.data)

        this.initVis()
    }

    initVis(){
        let vis = this;

        vis.margin = {top: 30, right: 10, bottom: 50, left: 20};

        vis.width = 400 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;
        console.log(vis.width)
        console.log(vis.height)
        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width])
            .domain([0, 17]);

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

        vis.svg.append('g')
            .selectAll("dot")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                console.log(vis.x(d.FAMINCOME));
                return vis.x(d.FAMINCOME); } )
            .attr("cy", function (d) {
                console.log(vis.y(d.avgHours));
                return vis.y(d.avgHours); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2")

        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }
}