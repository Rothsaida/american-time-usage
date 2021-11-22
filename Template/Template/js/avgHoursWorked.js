class LineChart {

// constructor method to initialize StackedAreaChart object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];


        // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
        console.log("AVG HOURS WORKED")
        console.log(this.data)

        this.initVis()
    }


    /*
     * Method that initializes the visualization (static content, e.g. SVG area or axes)
     */
    initVis(){
        let vis = this;

        vis.margin = {top: 90, right: 90, bottom: 30, left: 90};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#avg-hours-worked").append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

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

        // Update domain
        // Get the maximum of the multi-dimensional array or in other words, get the highest peak of the uppermost layer
        vis.x.domain([0,50]);
        vis.y.domain([0,100]);

        vis.svg.append('g')
            .selectAll("dot")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return vis.x(d.FAMINCOME); } )
            .attr("cy", function (d) { return vis.y(d.UHRSWORKT); } )
            .attr("r", 1.5)
            .style("fill", "#69b3a2")


        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);
    }
}