class ClockChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = data;

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

        this.clockGroup, this.fields, this.formatHour, this.formatMinute, this.formatSecond, this.height,
            this.offSetX, this.offSetY, this.pi, this.render, this.scaleHours, this.scaleSecsMins, this.visual, this.width;


        this.initVis();
    }

    initVis() {
        let vis = this;

        // margin conventions
        vis.margin = {top: 10, right: 50, bottom: 10, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // pie chart setup
        vis.pieChartGroup = vis.svg.append('g')
            .attr('id', 'pieDivRight')
            .attr("transform", "translate(" + vis.width / 2 + "," + vis.height / 2 + ")");

        vis.pie = d3.pie()
            .value(d => d.DURATION)
            // .startAngle(Math.PI / 3);

        vis.outerRadius = vis.width / 4;
        vis.innerRadius = vis.outerRadius / 3;

        vis.arc = d3.arc()
            .innerRadius(vis.innerRadius)
            .outerRadius(vis.outerRadius);

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieTooltip')

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        let parseTime = d3.timeParse("%H:%M:%S");

        vis.displayData.forEach(d => {
            d.DURATION = +d.DURATION;
            d.START = parseTime(d.START);
            d.STOP = parseTime(d.STOP);
        })

        console.log("clock data", vis.displayData);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        let durations = {
            entryAnimation: 8000
        };

        // Bind data
        vis.arcs = vis.pieChartGroup.selectAll(".arc")
            .data(vis.pie(vis.displayData))

        // Append paths
        vis.arcs.enter()
            .append("path")
            .merge(vis.arcs)
            .attr("d", vis.arc)
            .attr("fill", d => vis.colorScale(d.data.activityTopLevel))
            .attr("fill-opacity", 0.5)

            .on("mouseover", function(e, d) {
                // show selection of arc
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                // .attr('fill', 'rgb(173,222,255)')

                // display info with tooltip
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", e.pageX + 20 + "px")
                    .style("top", e.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h3>${vis.codeToActivity(d.data.activityTopLevel)}<h3>
                             <h4> Duration: ${d.data.DURATION.toFixed(2)} mins</h4>                       
                         </div>`);
            })

            .on('mouseout', function(e, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", d => vis.colorScale(d.data.activityTopLevel))

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })

        let angleInterpolation = d3.interpolate(vis.pie.startAngle()(), vis.pie.endAngle()());
        let innerRadiusInterpolation = d3.interpolate(0, vis.innerRadius);
        let outerRadiusInterpolation = d3.interpolate(0, vis.outerRadius);

        let arc = d3.arc();

        vis.arcs.transition()
            .duration(durations.entryAnimation)
            .attrTween("d", d => {
                let originalEnd = d.endAngle;
                return t => {
                    let currentAngle = angleInterpolation(t);
                    if (currentAngle < d.startAngle) {
                        return "";
                    }

                    d.endAngle = Math.min(currentAngle, originalEnd);

                    return arc(d);
                };
            });

        vis.pieChartGroup.selectAll(".arc")
            .transition()
            .duration(durations.entryAnimation)
            .tween("arcRadii", () => {
                return t => arc
                    .innerRadius(innerRadiusInterpolation(t))
                    .outerRadius(outerRadiusInterpolation(t));
            });


    }

    codeToActivity(code) {
        switch(code) {
            case '01':
                return "Sleep";
            case '02':
                return "Household Activities";
            case '03':
                return "Household Carework";
            case '04':
                return "Nonhousehold Carework";
            case '05':
                return "Work";
            case '06':
                return "Education";
            case '07':
                return "Shopping";
            case '08':
                return "Financial Activities";
            case '09':
                return "Household Services";
            case '10':
                return "Government Activities";
            case '11':
                return "Eating and Drinking";
            case '12':
                return "Leisure";
            case '13':
                return "Sports";
            case '14':
                return "Religious";
            case '15':
                return "Volunteer Activities";
            case '16':
                return "Telephone Calls";
            case '18':
                return "Travel";
            case '50':
                return "Uncategorized";
        }
    }
}