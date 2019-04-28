
# Quick Start

ClChartSupports custom drawing plug-ins, now has plug-in data tag types

## Install ClChart

ClChart can be used with ES6 modules, plain JavaScript and module loaders.

## Manual Download

You can download the latest version of `clchart` from the [GitHub releases](https://github.com/seerline/clchart/releases/latest)

## Npm install

```bash
npm install clchart --save
```

## Build From Source

Cloning and building the base project:

```shell
git clone git@github.com:seerline/clchart.git
cd clchart
npm install

# Then to build
npm run build
```

## HTML

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <!-- 引入 ClChart 文件 -->
    <script src="./clchart.js"></script>
</head>
</html>
```

## Create a Min Chart

### Initialization project

- Create a directory `clchart-demo`
- Create a `demo01.html` file
- Create a `js` directory for storing `javascript` files
- Download the stock data we have prepared , [stockdata](https://seerline.github.io/clchart/stockdata.js) , place it under the - jsdirectory
- Copy the previous section we downloaded `clchart.js` to the `js` directory below

Now our file structure is

```
clchart-demo
├── js
|   ├── stockdata.js
|   └── clchart.js
└── demo01.html
```

## Initialize the HTML file

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>ClChat Demo</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
    }

    canvas {
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    html, body, .container {
      height: 100%;
      width: 100%;
      background-color: #3b3b42;
      color: #f5f5f5;
    }
    .container {
      position: relative;
    }
    .chart-canvas {
      heigth: 100%;
      width: 100%;
    }
    #cursorChart {
      position: absolute;
      top: 0;
      left: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <canvas class="chart-canvas" id="myChart" width="400" height="600"></canvas>
    <canvas class="chart-canvas" id="cursorChart" width="400" height="600"></canvas>
  </div>

  <script src="./js/stockdata.js"></script>
  <script src="./js/clchart.js"></script>
</body>
</html>
```

### Start drawing


```html
<script>
  // Get main canvas and cursor canvas in the page
  // mainCanvas is used to draw the main image
  // cursorCanvas used to draw a cross cursor
  const mainCanvas = document.getElementById('myChart')
  const mainCtx = mainCanvas.getContext('2d')
  const cursorCanvas = document.getElementById('cursorChart')
  const cursorCtx = cursorCanvas.getContext('2d')

  // Set the configuration of the drawing and pass in the mainCanvas and cursorCanvas for initialization
  const syscfg = {
    scale: window.devicePixelRatio,
    axisPlatform: 'web', // 'phone' | 'web'
    mainCanvas: {
      canvas: mainCanvas,
      context: mainCtx
    },
    cursorCanvas: {
      canvas: cursorCanvas,
      context: cursorCtx
    }
  }
  // Create a single stock instance of Chart
  const Chart = ClChart.createSingleChart(syscfg)

  // Clear canvas, and data
  Chart.clear()
  const code = 'SH000001'
  // data initialization
  // Initialize the current transaction date
  Chart.initData(20180413, ClChart.DEF_DATA.STOCK_TRADETIME)
  // Initialize the stock information, the specific field configuration can view the data layer, the definition of various data structures
  Chart.setData('INFO', ClChart.DEF_DATA.FIELD_INFO, getMockData(code, 'INFO'))
  Chart.setData('MIN', ClChart.DEF_DATA.FIELD_MIN, getMockData(code, 'MIN'))
  Chart.setData('TICK', ClChart.DEF_DATA.FIELD_TICK, getMockData(code, 'TICK'))
  Chart.setData('NOW', ClChart.DEF_DATA.FIELD_NOW, getMockData(code, 'NOW'))
  // Configure the size of each area of the canvas
  // The height of the main map
  let mainHeight = canvas.height * 2 / 3
  let mainWidth = canvas.width
  // Set the canvas area layout
  const mainLayoutCfg = {
    layout: ClChart.DEF_CHART.CHART_LAYOUT,
    config: ClChart.DEF_CHART.CHART_NOW,
    rectMain: {
      left: 0,
      top: 0,
      width: mainWidth,
      height: mainHeight
    }
  }
  const mainChart = Chart.createChart('MIN', 'system.chart', mainLayoutCfg, function (result) {})
  Chart.bindData(mainChart, 'MIN')

  const volumeLayoutCfg = {
    layout: ClChart.DEF_CHART.CHART_LAYOUT,
    config: ClChart.DEF_CHART.CHART_NOWVOL,
    rectMain: {
      left: 0,
      top: mainHeight,
      width: mainWidth,
      height: canvas.height - mainHeight
    }
  }
  const volumeChart = Chart.createChart('MINNOW', 'system.chart', volumeLayoutCfg, function (result) {})
  Chart.bindData(volumeChart, 'MIN')
  // Perform drawing
  Chart.onPaint()
</script>
```

We have now completed the drawing of a simple exponential time-sharing diagram. Can view[demo01](https://seerline.github.io/clchart/samples/guide/demo01.html)