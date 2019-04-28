
# 快速入门

clchart可以与ES6模块，普通的JavaScript和模块加载器一起使用。

## 安装 clchart

你可以通过以下几种方式安装 clchart

## npm 安装

``` bash
npm install --save clchart

```

如果您使用模块加载器则可以直接在使用到clchart的地方引入文件
```js
import clchart from 'clchart'
```
或者
```js
const clchart = require('clchart')
```


## html文件引入

在 clchart 的 [GitHub](https://github.com/seerline/clchart/releases) 上下载最新的 release 版本的clchart.js文件，然后将其引入到您的网页中

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <!-- 引入 clchart 文件 -->
    <script src="./clchart.js"></script>
</head>
</html>
```

## 绘制分钟图

### 初始化项目

- 创建一个目录`clchart-demo`
- 创建`demo01.html`文件
- 创建`js`目录用来存放`javascript`文件
- 下载我们已经准备好的股票数据[stockdata](https://seerline.github.io/clchart/stockdata.js)，将其放在`js`目录下面
- 将上一节我们下载的`clchart.js`复制到`js`目录下面

现在我们的文件结构为
```
clchart-demo
├── js
|   ├── stockdata.js
|   └── clchart.js
└── demo01.html
```

### 初始化HTML文件

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

### 开始画图


```html
<script>
  // 获取页面中的main canvas以及cursor canvas
  // mainCanvas 用来绘制主图
  // cursorCanvas 用来绘制十字光标
  const mainCanvas = document.getElementById('myChart')
  const mainCtx = mainCanvas.getContext('2d')
  const cursorCanvas = document.getElementById('cursorChart')
  const cursorCtx = cursorCanvas.getContext('2d')

  // 定于绘图的配置，并且把mainCanvas及cursorCanvas传入做初始化
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
  // 创建单一股票Chart实例
  const Chart = clchart.createSingleChart(syscfg)

  // 清除画布，及数据
  Chart.clear()
  const code = 'SH000001'
  // 数据初始化
  // 初始化当前交易日期
  Chart.initData(20180413, clchart.DEF_DATA.STOCK_TRADETIME)
  // 初始化股票信息，具体字段配置可以查看关于数据层，各种数据结构的定义
  Chart.setData('INFO', clchart.DEF_DATA.FIELD_INFO, getMockData(code, 'INFO'))
  Chart.setData('MIN', clchart.DEF_DATA.FIELD_MIN, getMockData(code, 'MIN'))
  Chart.setData('TICK', clchart.DEF_DATA.FIELD_TICK, getMockData(code, 'TICK'))
  Chart.setData('NOW', clchart.DEF_DATA.FIELD_NOW, getMockData(code, 'NOW'))
  // 配置画布各个区域的大小
  // 主图高度
  let mainHeight = canvas.height * 2 / 3
  let mainWidth = canvas.width
  // 设置画布区域布局
  const mainLayoutCfg = {
    layout: clchart.DEF_CHART.CHART_LAYOUT,
    config: clchart.DEF_CHART.CHART_NOW,
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
    layout: clchart.DEF_CHART.CHART_LAYOUT,
    config: clchart.DEF_CHART.CHART_NOWVOL,
    rectMain: {
      left: 0,
      top: mainHeight,
      width: mainWidth,
      height: canvas.height - mainHeight
    }
  }
  const volumeChart = Chart.createChart('MINNOW', 'system.chart', volumeLayoutCfg, function (result) {})
  Chart.bindData(volumeChart, 'MIN')
  // 执行绘图
  Chart.onPaint()
</script>
```

现在我们已经完成了一个简单的指数分时图的绘制了。可以查看[demo01](https://seerline.github.io/clchart/samples/guide/demo01.html)