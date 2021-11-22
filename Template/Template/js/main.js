


// init global variables & switches
let myStackedArea;
let myBubbleChart;

// load data using promises
let promises = [
    d3.json("data/topLevelPercentage2.json")
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
    console.log('check out the data', dataArray[0]);
    dataArray[0] = prepareData(dataArray[0])

    // init table
    myStackedArea = new StackedAreaChart('stacked-area-chart', dataArray[0]);
    myBubbleChart = new BubbleChart('bubble-chart', dataArray[0]);
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

