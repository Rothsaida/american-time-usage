class ChangeBarChart {

// constructor method to initialize StackedAreaChart object
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;


        // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
        //console.log("AVG HOURS WORKED")
        // console.log(this.data)

        this.initVis()
    }

    initVis(){
        let vis = this;


        vis.margin = {top: 40, right: 150, bottom: 130, left: 170};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height  - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // TO-DO: (Filter, aggregate, modify data)
        vis.wrangleData();

    }

    /*
     * Data wrangling
     */
    wrangleData(){
        let vis = this;

        vis.data.sort(function(b, a) {
            return a[value] - b[value];
        });

        vis.x = d3.scaleBand()
            .range([ 0, vis.width ])
            .domain(vis.data.map(function(d) { return d.activityTopLevel; }))
            .padding(0.2);

        vis.svg.append("g")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(d3.axisBottom(vis.x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .attr("font-size", "7px")
            .style("text-anchor", "end");

        vis.y = d3.scaleLinear()
            .domain([
                d3.min(vis.data, function (d) {
                    if (value == "avgTime19" || value == "avgTime20") {
                        return Number(d[value])
                    } else {
                        return Number(d[value]) - 7
                    }
                }),
                d3.max(vis.data, d=>Number(d[value])) + 7])
            .range([ vis.height, 0]);

        vis.svg.append("g")
            .call(d3.axisLeft(vis.y));

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')

        // Update the visualization
        vis.updateVis();
    }

    /*
     * The drawing function - should use the D3 update sequence (enter, update, exit)
     * Function parameters only needed if different kinds of updates are needed
     */
    updateVis(){
        let vis = this;

        let baseline = vis.y(0);

        vis.svg.selectAll("mybar")
            .data(vis.data)
            .enter()
            .append("rect")
            .attr("x", function(d) { return vis.x(d.activityTopLevel); })
            .attr("y", function(d) {
                if(d[value] >= 0) {
                    return vis.y(d[value]);
                }
                if(d[value] < 0) {
                    return baseline;
                }
            })
            .attr("width", vis.x.bandwidth())
            .attr("height", function(d) {
                if(d[value] >= 0) {
                    return baseline - vis.y(d[value]);
                }
                if(d[value] < 0) {
                    return (vis.y(d[value]) - baseline);
                }
            })
            .attr("fill", function(d) {
                if(d[value] >= 0) {
                    return "green";
                }
                if(d[value] < 0) {
                    return "red";
                }
            })
            .on("mouseover", function(e, d) {
                // show selection of arc
                d3.select(this)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2')

                // display info with tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", e.pageX + 20 + "px")
                    .style("top", e.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 2px; background: lightgrey; padding: 5px">
                             <h5> Category: ${d.activityTopLevel}</h5>
                             <h6> Change from 2019 to 2020: ${Number(d.change).toFixed(2)}% (or ${Number(d.minChange).toFixed(2)} average minutes) </h6>
                             <h6> Average Minutes per Day in 2019: ${Number(d.avgTime19).toFixed(1)} </h6>
                             <h6> Average Minutes per Day in 2020: ${Number(d.avgTime20).toFixed(1)} </h6>           
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

        vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -40)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .attr("font-size", "10px")
            .text(function() {
                if (value == "change") {
                    return "percent change";
                } else if (value == "minChange") {
                    return "change in minutes per day from 2019 to 2020";
                } else if (value == "avgTime19" || value == "avgTime20") {
                    return "minutes per day";
                } else {
                    return " ";
                }
            });

    }
}
