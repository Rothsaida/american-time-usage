


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
let myActivitiesByMixed;
let selectedCategory = "SEX";
let myChangeBar;
let myRacialDisparities;


// load data using promises
let promises = [
    d3.json("data/topLevelPercentage2.json"),
    d3.csv("data/fulltimeHoursworked.csv"),
    d3.csv("data/gendergrouping.csv"),
    d3.csv("data/groupingbyrace.csv"),
    d3.csv("data/change.csv"),
    d3.csv("data/racial-disparities-copy.csv")
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

    // log data
    // console.log('check out the data', dataArray[0]);

    dataArray[0] = prepareData(dataArray[0])

    // init visualizations
    myStackedArea = new StackedAreaChart('stacked-area-chart', dataArray[0]);
    myBubbleChart = new BubbleChart('bubble-chart', dataArray[0]);
    myAvgHoursWorked = new LineChart('avg-hours-worked', dataArray[1]);
    myChangeBar = new ChangeBarChart('change-bar-chart', dataArray[4]);
    myActivitiesByMale = new PieChart('top-five-male', dataArray[2], ["SEX", "1", "Male"]);
    myActivitiesByFemale = new PieChart('top-five-female', dataArray[2], ["SEX", "2", "Female"]);
    myActivitiesByWhite = new PieChart('top-five-white', dataArray[3], ["RACE", "100", "White"]);
    myActivitiesByBlack = new PieChart('top-five-black', dataArray[3], ["RACE", "110", "Black"]);
    myActivitiesByNative = new PieChart('top-five-native', dataArray[3], ["RACE", "120", "Native American"]);
    myActivitiesByAsian = new PieChart('top-five-asian', dataArray[3], ["RACE", "13", "Asian or Pacific Islander"]);
    myActivitiesByMixed = new PieChart('top-five-mixed', dataArray[3], ["RACE", "", "Two or more races"]);
    myRacialDisparities = new LineChartRate('unemployment-rate', dataArray[5]);

    updateCategory();
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

function updateCategory() {
    selectedCategory = $('#chart-option').val();
    console.log(selectedCategory);
    if (selectedCategory === "SEX") {
        document.getElementById('top-five-male').style.visibility = "visible"
        document.getElementById('top-five-female').style.visibility = "visible"
        document.getElementById('top-five-white').style.visibility = "hidden"
        document.getElementById('top-five-black').style.visibility = "hidden"
        document.getElementById('top-five-native').style.visibility = "hidden"
        document.getElementById('top-five-asian').style.visibility = "hidden"
        document.getElementById('top-five-mixed').style.visibility = "hidden"
    } else {
        document.getElementById('top-five-male').style.visibility = "hidden"
        document.getElementById('top-five-female').style.visibility = "hidden"
        document.getElementById('top-five-white').style.visibility = "visible"
        document.getElementById('top-five-black').style.visibility = "visible"
        document.getElementById('top-five-native').style.visibility = "visible"
        document.getElementById('top-five-asian').style.visibility = "visible"
        document.getElementById('top-five-mixed').style.visibility = "visible"
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
    // highlightYear = d3.select("#year").property("value");
    // let oldSVGLine = d3.select("#avg-hours-worked");
    // oldSVGLine.selectAll('*').remove();
    // // so it changes with new selections
    // myAvgHoursWorked.initVis();
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
}