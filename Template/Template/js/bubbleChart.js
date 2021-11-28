class BubbleChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        console.log(this.data);

        // let parseDate = d3.timeParse("%Y");
        // console.log(parseDate("2020"))
        // this.displayData = this.data.filter(d => d.YEAR === parseDate("2020"));
        this.displayData = [];

        let colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c',
            '#fdbf6f','#ff7f00','#cab2d6','#6a3d9a', '#fcba03', '#9ad9a6',
            '#ff3856', '#0d00ff', '#e3d800', '#e34800', '#584fab', '#22e6cf'];

        // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
        this.dataCategories = Object.keys(this.data[0]).filter(d=>d !== "YEAR")
        // console.log(this.dataCategories)

        // prepare colors for range
        let colorArray = this.dataCategories.map( (d,i) => {
            return colors[i%18]
        })
        // Set ordinal color scale
        this.colorScale = d3.scaleOrdinal()
            .domain(this.dataCategories)
            .range(colorArray);

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 90, right: 90, bottom: 0, left: 90};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        vis.radius = d3.scaleLinear()
            .range([0, vis.width/8]);

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.yearData = vis.data.at(-1);
        delete vis.yearData.YEAR;

        Object.keys(vis.yearData).forEach(key => {
            vis.displayData.push({
                Activity: key,
                TimeSpent: vis.yearData[key]
            })
        })

        console.log(vis.displayData);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.radius.domain([0, d3.max(vis.displayData, d => d.TimeSpent)]);
        //
        // let bubble = d3.pack(vis.displayData)
        //     .size([vis.width, vis.height])
        //     .padding(1.5);
        //
        // let nodes = d3.hierarchy(vis.displayData)
        //     .sum(d => d.TimeSpent);
        //
        // let node = vis.svg.selectAll(".node")
        //     .data(bubble(nodes).descendants())
        //     .enter()
        //     .filter(d => !d.children)
        //     .append("g")
        //     .attr("class", "node")
        //     .attr("transform", d => `translate (${d.x}, ${d.y})`);

        let Tooltip = d3.select("#bubble-chart")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        let node = vis.svg.append("g")
            .selectAll("circle")
            .data(vis.displayData)
            .enter()
            .append("circle")
            .attr("cx", vis.width/2)
            .attr("cy", vis.height/2)
            .attr("r", d => vis.radius(d.TimeSpent))
            .attr("fill", d => vis.colorScale(d.Activity))
            .on("mouseover", d => Tooltip.style("opacity", 1))
            .on("mousemove", (e, d) =>
                Tooltip.html(`<u>${d.Activity}</u>`)
                    .style("left", (e.pageX+20) + "px")
                    .style("top", (e.pageY) + "px")
            )
            .on("mouseout", d => Tooltip.style("opacity", 0))

        // node.selectAll("text")
        //     .data(vis.displayData)
        //     .enter()
        //     .append("text")
        //     .attr("class", "bubble-text")
        //     .attr("x", vis.width/2)
        //     .attr("y", vis.height/2)
        //     .attr("fill", "gray")
        //     .text(d => d)

        let simulation = d3.forceSimulation()
            .force("center", d3.forceCenter().x(vis.width/2).y(vis.height/2))  // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(0.5)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(0.5).radius(d => vis.radius(d.TimeSpent)).iterations(1)) // Force that avoids circle overlapping

        simulation
            .nodes(vis.displayData)
            .on("tick", function(d){
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        });

        //
        // let labels = vis.svg.selectAll("text")
        //     .data(Object.keys(vis.displayData))
        //
        // labels.enter()
        //     .append("text")
        //     .attr("class", "bubble-text")
        //     .attr("x", (d, i) => i*vis.displayData[d])
        //     .attr("y", (d, i) => i*vis.displayData[d])
        //     .attr("fill", "gray")
        //     .text(d => d)
    }
}