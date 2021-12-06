class PieChart {
    constructor(parentElement, data, category) {
        this.parentElement = parentElement;
        this.data = data;
        this.category = category;
        this.displayData = [];

        this.colors = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c',
            '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#fcba03', '#9ad9a6',
            '#ff3856', '#0d00ff', '#e3d800', '#e34800', '#584fab', '#22e6cf'];

        // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
        this.dataCategories = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
            '11', '12', '13', '14', '15', '16', '18', '50']

        // prepare colors for range
        let colorArray = this.dataCategories.map((d, i) => {
            return this.colors[i % 18]
        })
        // Set ordinal color scale
        this.colorScale = d3.scaleOrdinal()
            .domain(this.dataCategories)
            .range(colorArray);

        this.initVis();
    }

    initVis() {
        let vis = this;

        // margin conventions
        vis.margin = {top: 75, right: 50, bottom: 75, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // add title
        vis.svg.append('g')
            .attr('class', 'title pie-title')
            .append('text')
            .text(vis.category)
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // pie chart setup
        vis.pieChartGroup = vis.svg.append('g')
            .attr('id', 'pieDivRight')
            .attr("transform", "translate(" + vis.width / 2 + "," + vis.height / 2 + ")");

        vis.pie = d3.pie()
            .value(d => d.duration);

        vis.outerRadius = vis.width / 4;
        vis.innerRadius = 0;

        vis.arc = d3.arc()
            .innerRadius(vis.innerRadius)
            .outerRadius(vis.outerRadius);

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'pieTooltip')


        // call next method in pipeline
        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.data.forEach(d => {
            vis.displayData.push({
                activity: d.activityTopLevel,
                duration: +d.duration
            })
        })

        if (vis.displayData.length > 18) {
            let rolled = d3.rollup(vis.displayData, v=>d3.mean(v, d=>d.duration), d=>d.activity)
            vis.displayData = [];
            rolled = Object.fromEntries(rolled)
            Object.entries(rolled).forEach(d => vis.displayData.push({
                activity: d[0],
                duration: d[1]
            }))
        }

        vis.displayData.sort((a, b) => (a.duration > b.duration) ? -1 : 1)
        vis.displayData = vis.displayData.slice(0,5);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Bind data
        vis.arcs = vis.pieChartGroup.selectAll(".arc")
            .data(vis.pie(vis.displayData))

        // Append paths
        vis.arcs.enter()
            .append("path")
            .merge(vis.arcs)
            .attr("d", vis.arc)
            .attr("fill", d => vis.colorScale(d.data.activity))

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
                         <div style="border: thin solid black; border-radius: 5px; background: white; padding: 20px; opacity: 0.9; font-family: Constantia">
                             <h3>${vis.codeToActivity(d.data.activity)}<h3>
                             <h4> Duration: ${d.data.duration.toFixed(2)} mins</h4>                       
                         </div>`);
            })

            .on('mouseout', function(e, d) {
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", d => vis.colorScale(d.data.activity))

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
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