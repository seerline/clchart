---
sidebar: auto
---

# Introduction
## What is ClChart

[ClChart](https://github.com/seerline/clchart) is a simple, high-performance and cross-platform open source project for stock data visualization created based on the canvas. Support PC, webApp and [React Native](https://github.com/facebook/react-native) and [Weex](https://github.com/apache/incubator-weex) platforms. Fully adapting the open source project GCanvas on [React Native](https://github.com/facebook/react-native) and [Weex](https://github.com/apache/incubator-weex) makes it easy to use [GCanvas](https://github.com/alibaba/GCanvas) to enable your developed applications to have native drawing capabilities on android and ios.

### Why do you need ClChart

In the existing open source libraries, there are no shortage of very good open source chart libraries. The general chart libraries include [chartjs](https://github.com/chartjs/Chart.js),[echart](https://github.com/apache/incubator-echarts),[highchart](https://github.com/highcharts/highcharts), etc. These chart libraries have very complete chart types and powerful drawing capabilities and speeds, but due to the need of these items There is generality, and we need to expand when we draw the trading document. The specific chart libraries for stocks such as stocks are: [techanjs](https://github.com/andredumas/techan.js) and [highcharts/highstock](https://github.com/highcharts/highcharts) . These charting libraries have done some very professional processing and optimization of the stock drawing, but they are all based on svgdrawing. We have performance issues when drawing large numbers of data graphs and dealing with cross-platforms.

#### The following is a comparison of the K-charts drawn by the stocks of each gallery in the use process.

> The following comparisons are based on the use of these charting libraries to draw comparisons of the mapping capabilities of the securities of the securities type, and the data subjective experience determination.

|   | chartjs | echart | techanjs | highchart | clchart |
| --- | --- | --- | --- | --- | --- |
| Drawing element |canvas| canvas & svg| svg | svg | canvas |
| Easy to use | ☆☆☆☆☆ | ☆☆☆ | ☆☆☆☆  | ☆☆☆☆ | ☆☆☆☆☆ |
| Drawing speed | ☆☆☆☆☆ | ☆☆☆ | ☆☆ | ☆☆ | ☆☆☆☆☆ |
| Expanding ability | ☆☆☆ | ☆☆☆☆ | ☆☆☆☆ | ☆☆☆☆ | ☆☆☆☆☆ |
| Cross-platform | ☆☆☆ | ☆☆☆ | ☆☆ | ☆ | ☆☆☆☆☆ |

Therefore, we urgently need an icon library with high-performance, cross-platform, and easy-to-use stock types.

> In the existing icon library [React Native](https://github.com/facebook/react-native), you can load html files via webview, use `window.document.addEventListener('message', function(e) {})`and `window.postMessageto` complete the html and React Natve communication drawing, but use the actual use process, in some poor performance android devices, especially android `Android` systems with versions lower than `4.4` perform particularly badly when plotting large data volume graphs and user interactions. Caton often occurs, and there may be issues such as slow loading.

### ClChart design goals

The use of canvasdevelopment has a highly efficient , cross-platform of professional stock charting library 📈

Having compatible [GCanvas](https://github.com/alibaba/GCanvas) provided canvasinterface, in [React Native](https://github.com/facebook/react-native) and [Weex](https://github.com/apache/incubator-weex) reach native drawing on, and able to live horizontally extended for more stock market equation system in the form of plug-ins, for users with special needs, it is possible to provide custom Plug-in and data structure capabilities.

### ClChart Features

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