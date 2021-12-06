class ChangeBarChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.colors = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c',
            '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#fcba03', '#9ad9a6',
            '#ff3856', '#0d00ff', '#e3d800', '#e34800', '#584fab', '#22e6cf'];

        // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
        this.dataCategories = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
            '11', '12', '13', '14', '15', '16', '18', '50']
        // console.log(this.dataCategories)

        // prepare colors for range
        let colorArray = this.dataCategories.map((d, i) => {
            return this.colors[i % 18]
        })
        // Set ordinal color scale
        this.colorScale = d3.scaleOrdinal()
            .domain(this.dataCategories)
            .range(colorArray);

        // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
        //console.log("AVG HOURS WORKED")
        // console.log(this.data)

        this.initVis()
    }

    initVis(){
        let vis = this;


        vis.margin = {top: 40, right: 150, bottom: 135, left: 170};

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
            .attr("transform", "translate(-10,0)rotate(-40)")
            .attr("font-size", "12px")
            .style("text-anchor", "end")
            .style("font-family", "Constania");

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
                return vis.colorScale(d.activityTopLevel);
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
                         <div style="border: thin solid black; border-radius: 2px; background: white; padding: 5px; font-family: Constantia;">
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
            .transition()
            .duration(1000);

        vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -45)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .attr("font-size", "15px")
            .style("font-family", "Constania")
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
