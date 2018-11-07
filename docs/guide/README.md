---
sidebar: auto
---

# Introduction

## Why do you need ClChart

In the existing open source libraries, there are no shortage of very good open source chart libraries. The general chart libraries include [chartjs](https://github.com/chartjs/Chart.js),[echart](https://github.com/apache/incubator-echarts),[highchart](https://github.com/highcharts/highcharts), etc. These chart libraries have very complete chart types and powerful drawing capabilities and speeds, but due to the need of these items There is generality, and we need to expand when we draw the trading document. The specific chart libraries for stocks such as stocks are: [techanjs](https://github.com/andredumas/techan.js) and [highcharts/highstock](https://github.com/highcharts/highcharts) . These charting libraries have done some very professional processing and optimization of the stock drawing, but they are all based on svgdrawing. We have performance issues when drawing large numbers of data graphs and dealing with cross-platforms.

## What is ClChart

[ClChart](https://github.com/seerline/clchart) is a simple, high-performance and cross-platform open source project for stock data visualization created based on the canvas. Support PC, webApp and [React Native](https://github.com/facebook/react-native) and [Weex](https://github.com/apache/incubator-weex) platforms. Fully adapting the open source project GCanvas on [React Native](https://github.com/facebook/react-native) and [Weex](https://github.com/apache/incubator-weex) makes it easy to use [GCanvas](https://github.com/alibaba/GCanvas) to enable your developed applications to have native drawing capabilities on android and ios.



## ClChart design goals

The use of canvasdevelopment has a highly efficient , cross-platform of professional stock charting library 📈

Having compatible [GCanvas](https://github.com/alibaba/GCanvas) provided canvasinterface, in [React Native](https://github.com/facebook/react-native) and [Weex](https://github.com/apache/incubator-weex) reach native drawing on, and able to live horizontally extended for more stock market equation system in the form of plug-ins, for users with special needs, it is possible to provide custom Plug-in and data structure capabilities.

## ClChart Features

### Double-layer canvas

When studying the drawing program of tradingview , we found that in order to quickly redraw the auxiliary lines such as crosshairs, the use of double-layered canvasseparation crosshairs (such as auxiliary lines) and the drawing of the main layer greatly reduces the time needed to quickly move the crosshairs. The extra drawing calculations come. Enables androida smooth user experience on low-end mobile devices and web apps

### Scalable data layer

ClChartImplementation of an independent data layer, which can preprocess the data, cache functions, data FIELDdefinition and read through the field , the user can easily customize the data field to quickly integrate with the existing data.

### Custom formula

ClChartSupports custom formula systems. Both developers and users can customize formulas for drawing during use.

### Custom Plugin

## Quick Start

ClChartSupports custom drawing plug-ins, now has plug-in data tag types

### Install ClChart

ClChart can be used with ES6 modules, plain JavaScript and module loaders.

### Manual Download

You can download the latest version of `clchart` from the [GitHub releases](https://github.com/seerline/clchart/releases/latest)

### Npm install

```bash
npm install clchart --save
```

### Build From Source

Cloning and building the base project:

```shell
git clone git@github.com:seerline/clchart.git
cd clchart
npm install

# Then to build
npm run build
```

### HTML

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

### Create a Min Chart

#### Initialization project

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

### Initialize the HTML file

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

#### Start drawing


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
  const mainChart = Chart.createChart('MIN', 'CHART.LINE', mainLayoutCfg, function (result) {})
  Chart.bindData(mainChart, 'MIN')

  const volumeLoyoutCfg = {
    layout: ClChart.DEF_CHART.CHART_LAYOUT,
    config: ClChart.DEF_CHART.CHART_NOWVOL,
    rectMain: {
      left: 0,
      top: mainHeight,
      width: mainWidth,
      height: canvas.height - mainHeight
    }
  }
  const volumeChart = Chart.createChart('MINNOW', 'CHART.LINE', volumeLoyoutCfg, function (result) {})
  Chart.bindData(volumeChart, 'MIN')
  // Perform drawing
  Chart.onPaint()
</script>
```

We have now completed the drawing of a simple exponential time-sharing diagram. Can view[demo01](https://seerline.github.io/clchart/samples/guide/demo01.html)