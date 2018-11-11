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