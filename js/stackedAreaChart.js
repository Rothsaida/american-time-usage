class StackedAreaChart {

constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.displayData = [];

    let colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c',
		'#fdbf6f','#ff7f00','#cab2d6','#6a3d9a', '#fcba03', '#9ad9a6',
		'#ff3856', '#F6E2E5', '#c44fa1', '#eb86b6', '#7DDBD3', '#363636'];

    // grab all the keys from the key value pairs in data (filter out 'year' ) to get a list of categories
	this.dataCategories = Object.keys(this.data[0]).filter(d=>d !== "YEAR")

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


	/*
	 * Method that initializes the visualization (static content, e.g. SVG area or axes)
 	*/
	initVis(){
		let vis = this;

		vis.margin = {top: 30, right: 90, bottom: 30, left: 90};

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Overlay with path clipping
		vis.svg.append("defs").append("clipPath")
			.attr("id", "clip")

			.append("rect")
			.attr("width", vis.width)
			.attr("height", vis.height);

		// Scales and axes
		vis.x = d3.scaleTime()
			.range([0, vis.width])
			.domain(d3.extent(vis.data, d=> d.YEAR));

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

			// TO-DO (Activity II): Initialize stack layout
		let stack = d3.stack()
			.keys(vis.dataCategories);

            // TO-DO (Activity II) Stack data
		vis.stackedData = stack(vis.data);


            // TO-DO (Activity II) Stacked area layout
		vis.area = d3.area()
			.curve(d3.curveCardinal)
			.x(function(d) { return vis.x(d.data.YEAR); })
			.y0(function (d) { return vis.y(d[0]); })
			.y1(function(d) { return vis.y(d[1]); })


            // TO-DO (Activity IV): Add Tooltip placeholder
		vis.svg.append("text")
			.attr("class", "tooltip-text")
			.attr("x", 5)
			.attr("y", -10)
			.text(" ")

            // TO-DO: (Filter, aggregate, modify data)
            vis.wrangleData();

	}

	/*
 	* Data wrangling
 	*/
	wrangleData(){
		let vis = this;
        
        vis.displayData = vis.stackedData;

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
        vis.y.domain([0, d3.max(vis.displayData, function(d) {
            return d3.max(d, function(e) {
                return e[1];
            });
        })
        ]);

		// Draw the layers
		let categories = vis.svg.selectAll(".area")
			.data(vis.displayData);

		categories.enter().append("path")
			.attr("class", "area")
			.merge(categories)
			.style("fill", d => {
				return vis.colorScale(d)
			})
			.attr("d", d => vis.area(d))

			.on("mouseover", (event,d,i) => {
				d3.select(".tooltip-text").text(d.key)
			});
			

		categories.exit().remove();

		// Call axis functions with the new domain
		vis.svg.select(".x-axis").call(vis.xAxis);
		vis.svg.select(".y-axis").call(vis.yAxis);

		vis.svg.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "middle")
			.attr("x", -vis.height/2)
			.attr("y", -40)
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.attr("font-size", "10px")
			.text("Percentage of Time Spent on that Activity");
	}
}