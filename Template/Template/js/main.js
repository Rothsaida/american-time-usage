


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
let myClockChart;


// load data using promises
let promises = [
    d3.json("data/topLevelPercentage2.json"),
    d3.csv("data/fulltimeHoursworked.csv"),
    d3.csv("data/gendergrouping.csv"),
    d3.csv("data/groupingbyrace.csv"),
    d3.csv("data/change.csv"),
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
    // myClockChart = new ClockChart('clock-chart', dataArray[5])
    drawClocks(dataArray[5]);

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

function prepareRaceData(data) {
    return d3.group(data, d => d.RACE.substring(0, 2));
}

function prepareGenderData(data) {
    return d3.group(data, d => d.SEX.substring(0, 1));
}

function drawClocks(data) {
    let dataByPerson = d3.group(data, d=>d.YEAR, d=>d.personID)
    for(let [i,d] of Object.entries(dataByPerson)) {
        let clock = new ClockChart("clock-chart", d)
        if (i >= 2) {
            break;
        }
    }
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

