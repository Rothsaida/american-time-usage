class SleepHeatMap {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()
    }

    initVis(){
        let vis = this;


        vis.margin = {top: 50, right: 50, bottom: 50, left: 50};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height  - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.myGroups = ["Less than 4 hours", "Between 4 and 6 hours",
            "Between 6 and 8 hours", "Between 8 and 10 hours", "Between 10 and 12 hours", "More than 12 hours"]
        vis.myVars = ["55+", "35 to 54", "20 to 34",  "Under 20"]

        vis.x = d3.scaleBand()
            .range([ 0, vis.width ])
            .domain(vis.myGroups)
            .padding(0.01);

        vis.svg.append("g")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x))

        vis.y = d3.scaleBand()
            .range([vis.height, 0 ])
            .domain(vis.myVars)
            .padding(0.01);

        vis.svg.append("g")
            .call(d3.axisLeft(vis.y));

        vis.Color = d3.scaleLinear()
            .range(["#fbff8c", "#e60013"])
            .domain([0,d3.max(vis.data, d=>d.percentage)])

        vis.tooltip = d3.select("#" + vis.parentElement)
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

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

        vis.svg.selectAll()
            .data(vis.data, function(d) {return d.age_grouping+':'+d.activity_grouping;})
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return vis.x(d.activity_grouping) })
            .attr("y", function(d) { return vis.y(d.age_grouping) })
            .attr("width", vis.width / 6)
            .attr("height", vis.height / 4)
            .style("fill", function(d) { return vis.Color(d.percentage)} )
            .on("mouseover", function(e, d) {
                // show selection of arc
                d3.select(this)
                    .attr('stroke', 'white')
                    .attr('stroke-width', '2')

                // display info with tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", e.pageX + 20 + "px")
                    .style("top", e.pageY + "px")
                    .html(`
                         <div style="border: thin solid black; border-radius: 2px; background: white; padding: 5px; font-family: Constantia">
                             <h5> Age Group: ${d.age_grouping}</h5>
                             <h6> ${d.count} out of ${d.totals} in this age group</h6>
                             <h6> Percentage of Age Group: ${Number(d.percentage * 100).toFixed(1)}%</h6>
                         </div>`);
            })
            .on('mouseout', function(e, d) {
                d3.select(this)
                    .attr('stroke-width', '0')

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

    }
}
