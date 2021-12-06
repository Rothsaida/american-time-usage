


// init global variables & switches
let myStackedArea;
let myBubbleChart;
let myAvgHoursWorked;
let myActivitiesByMale;
let myActivitiesByFemale;
let myActivitiesByWhite;
let myActivitiesByBlack;
let myActivitiesByNative;
let myActivitiesByAsian;
let selectedCategory = "SEX";
let myChangeBar;
let myRacialDisparities;
let mySleepHeatmap;

// load data using promises
let promises = [
    d3.json("data/topLevelPercentage2.json"),
    d3.csv("data/fulltimeHoursworked.csv"),
    d3.csv("data/gendergrouping.csv"),
    d3.csv("data/groupingbyrace.csv"),
    d3.csv("data/change.csv"),
    d3.csv("data/racial-disparities-copy.csv"),
    d3.csv("data/sleepandpersonalcare.csv"),
    d3.csv("data/timeData.csv")
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

// initMainPage
function initMainPage(dataArray) {

    //East Scroll Dots
    easyScrollDots({
        'fixedNav': false,
        'fixedNavId': '',
        'fixedNavUpward': false,
        'offset': 0
    });

    // log data
    // console.log('check out the data', dataArray[0]);

    dataArray[0] = prepareData(dataArray[0]);
    dataArray[2] = prepareGenderData(dataArray[2]);
    dataArray[3] = prepareRaceData(dataArray[3]);

    // init visualizations
    myStackedArea = new StackedAreaChart('stacked-area-chart', dataArray[0]);
    myBubbleChart = new BubbleChart('bubble-chart', dataArray[0]);
    myAvgHoursWorked = new LineChart('avg-hours-worked', dataArray[1]);
    myChangeBar = new ChangeBarChart('change-bar-chart', dataArray[4]);
    myActivitiesByMale = new PieChart('top-five-male', dataArray[2].get("1"), "Male");
    myActivitiesByFemale = new PieChart('top-five-female', dataArray[2].get("2"), "Female");
    myActivitiesByWhite = new PieChart('top-five-white', dataArray[3].get("10"), "White");
    myActivitiesByBlack = new PieChart('top-five-black', dataArray[3].get("11"), "Black");
    myActivitiesByNative = new PieChart('top-five-native', dataArray[3].get("12"), "Native American");
    myActivitiesByAsian = new PieChart('top-five-asian', dataArray[3].get("13"), "Asian or Pacific Islander");
    myRacialDisparities = new LineChartRate('unemployment-rate', dataArray[5]);
    mySleepHeatmap = new SleepHeatMap('sleep-heatmap', dataArray[6]);
    // myClockChart = new ClockChart('clock-chart', dataArray[5])
    updateCategory();
    drawClocks(dataArray[7]);


}


// helper function
function prepareData(data){

    let parseDate = d3.timeParse("%Y");

    let preparedData = {};

    // Convert Pence Sterling (GBX) to USD and years to date objects
    preparedData.layers = data.map( d => {
        for (let column in d) {
            if(d.hasOwnProperty(column) && column === "YEAR") {
                d[column] = parseDate(d[column].toString());
            }
            if(d.hasOwnProperty(column) && column !== "YEAR") {
                d[column] = d[column] * 100;
            }
        }
    });

    //


    return data
}

function prepareRaceData(data) {
    return d3.group(data, d => d.RACE.substring(0, 2));
}

function prepareGenderData(data) {
    return d3.group(data, d => d.SEX.substring(0, 1));
}

function drawClocks(data) {
    let dataByPerson = d3.groups(data, d=>d.YEAR, d=>d.personID);
    let all_clocks = document.getElementById("clock-charts");

    for(let d of dataByPerson[1][1].slice(0,100)) {
        let clock_element = document.createElement("div");
        clock_element.id = `clock-chart-${d[1][0].personID}`;
        clock_element.style = "width: 100%; height: 100%";
        clock_element.className = "align-self-center";
        all_clocks.appendChild(clock_element);
        console.log(all_clocks)
        let clock = new ClockChart(`clock-chart-${d[1][0].personID}`, d[1]);
    }

    let outer_clock_el = document.createElement("div");
    outer_clock_el.id = `clock-chart-outer`;
    outer_clock_el.style = "width: 100%; height: 100%";
    outer_clock_el.className = "align-self-center";
    all_clocks.appendChild(outer_clock_el);
    let outer_clock = new OuterClock("clock-chart-outer");
}

function updateCategory() {
    selectedCategory = $('#chart-option').val();
    if (selectedCategory === "SEX") {
        document.getElementById('top-five-male').style.visibility = "visible"
        document.getElementById('top-five-female').style.visibility = "visible"
        document.getElementById('top-five-white').style.visibility = "hidden"
        document.getElementById('top-five-black').style.visibility = "hidden"
        document.getElementById('top-five-native').style.visibility = "hidden"
        document.getElementById('top-five-asian').style.visibility = "hidden"
    } else {
        document.getElementById('top-five-male').style.visibility = "hidden"
        document.getElementById('top-five-female').style.visibility = "hidden"
        document.getElementById('top-five-white').style.visibility = "visible"
        document.getElementById('top-five-black').style.visibility = "visible"
        document.getElementById('top-five-native').style.visibility = "visible"
        document.getElementById('top-five-asian').style.visibility = "visible"
    }
}

let value = d3.select("#ranking-type").property("value");
function selectChanged() {
    value = d3.select("#ranking-type").property("value");
    let oldSVG = d3.select("#change-bar-chart");
    oldSVG.selectAll('*').remove();
    // so it changes with new selections
    myChangeBar.initVis();
}

let highlightYear = 0;
function highlightYearFunction() {
    highlightYear = d3.select("#year").property("value");
    let oldSVGLine = d3.select("#avg-hours-worked");
    oldSVGLine.selectAll('*').remove();
    // so it changes with new selections
    myAvgHoursWorked.initVis();
}

let USAvgGuess = 0;
function guessUSAvgFunction() {
    var div = document.getElementById("unemployment-rate-guess");

    USAvgGuess = d3.select("#race").property("US");
    let oldSVGLine = d3.select("#unemployment-rate");
    oldSVGLine.selectAll('*').remove();
    // so it changes with new selections
    myRacialDisparities.initVis();
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    div.innerHTML += 'The Average US Unemployment Rate during this time period is about 6%.';
}

function guessJobLossFunction() {
    var div = document.getElementById("job-loss-guess");

    // so it changes with new selections
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    div.innerHTML += "<span style='font-size:40px'>22.3 Million</span>";
}

// Full page scroll
$(window).on("load",function() {
    $(window).scroll(function() {
        var windowBottom = $(this).scrollTop() + $(this).innerHeight();
        $(".fade-in").each(function() {
            /* Check the location of each desired element */
            var objectBottom = $(this).offset().top + $(this).outerHeight();

            /* If the element is completely within bounds of the window, fade it in */
            if (objectBottom < windowBottom) { //object comes into view (scrolling down)
                if ($(this).css("opacity")==0) {$(this).fadeTo(1000,1);}
            } else { //object goes out of view (scrolling up)
                if ($(this).css("opacity")==1) {$(this).fadeTo(1000,0);}
            }
        });
    }).scroll(); //invoke scroll-handler on page-load
});

// Animation across the screen - covid spheres - to fix
// function RandomObjectMover(obj, container) {
//     this.$object = obj;
//     this.$container = container;
//     this.container_is_window = container === window - 150;
//     this.pixels_per_second = 100;
//     this.current_position = { x: 0, y: 0 };
//     this.is_running = false;
// }
//
// // Set the speed of movement in Pixels per Second.
// RandomObjectMover.prototype.setSpeed = function(pxPerSec) {
//     this.pixels_per_second = pxPerSec;
// }
//
// RandomObjectMover.prototype._getContainerDimensions = function() {
//     if (this.$container === window) {
//         return { 'height' : this.$container.innerHeight, 'width' : this.$container.innerWidth };
//     } else {
//         return { 'height' : this.$container.clientHeight, 'width' : this.$container.clientWidth };
//     }
// }
//
// RandomObjectMover.prototype._generateNewPosition = function() {
//
//     // Get container dimensions minus div size
//     var containerSize = this._getContainerDimensions();
//     var availableHeight = containerSize.height - this.$object.clientHeight;
//     var availableWidth = containerSize.width - this.$object.clientHeight;
//
//     // Pick a random place in the space
//     var y = Math.floor(Math.random() * availableHeight);
//     var x = Math.floor(Math.random() * availableWidth);
//
//     return { x: x, y: y };
// }
//
// RandomObjectMover.prototype._calcDelta = function(a, b) {
//     var dx   = a.x - b.x;
//     var dy   = a.y - b.y;
//     var dist = Math.sqrt( dx*dx + dy*dy );
//     return dist;
// }
//
// RandomObjectMover.prototype._moveOnce = function() {
//     // Pick a new spot on the page
//     var next = this._generateNewPosition();
//
//     // How far do we have to move?
//     var delta = this._calcDelta(this.current_position, next);
//
//     // Speed of this transition, rounded to 2DP
//     var speed = Math.round((delta / this.pixels_per_second) * 100) / 100;
//
//     //console.log(this.current_position, next, delta, speed);
//
//     this.$object.style.transition='transform '+speed+'s linear';
//     this.$object.style.transform='translate3d('+next.x+'px, '+next.y+'px, 0)';
//
//     // Save this new position ready for the next call.
//     this.current_position = next;
//
// };
//
// RandomObjectMover.prototype.start = function() {
//
//     if (this.is_running) {
//         return;
//     }
//
//     // Make sure our object has the right css set
//     this.$object.willChange = 'transform';
//     this.$object.pointerEvents = 'auto';
//
//     this.boundEvent = this._moveOnce.bind(this)
//
//     // Bind callback to keep things moving
//     this.$object.addEventListener('transitionend', this.boundEvent);
//
//     // Start it moving
//     this._moveOnce();
//
//     this.is_running = true;
// }
//
// // Init it
// var x = new RandomObjectMover(document.getElementById('covid-sphere'), window);
//
// // Start it off
//
// x.start();