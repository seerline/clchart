/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// Following is the entity definition of ClChart
// generally only use this class to implement the function
// A ClChart class is just a drawing of the chart belonging to the dispatch framework, mouse and keyboard events, and does not store data
// When multiple maps are linked, the subgraphs are all here to get relevant information.

import {
  copyJsonOfDeep
} from '../util/cl.tool'
import ClChartLine from './cl.chart.line'
import ClChartOrder from './cl.chart.order'
import { setColor, setStandard } from '../chart/cl.chart.init'

const DEFAULT_LINKINFO = {
  showMode: 'last',
  // 'last' Targeted by the latest data, maxIndex=-1 shows the latest data
  // 'move' Set this parameter when the move occurs, -- may not be required
  // 'fixed' Fixed display of a certain range of time-shared charts and 5-day lines.
  // 'locked' Specify a record in the middle
  fixed: { // 对应fixed模式
    min: -1, // 最小记录, 为-1表示最小记录加上left
    max: -1, // 最大记录, 为-1表式最大记录减去right
    left: 20,
    right: 20
  },
  locked: { // 只有当showMode=='locked'模式才有作用
    index: -1, // 当前锁定的记录号，
    set: 0.5 // 表示锁定在中间，1表示锁定在最后一条记录，当前记录的百分比
  },
  minIndex: -1, // 当前画面的起始记录号 -1 表示第一次
  maxIndex: -1, // 当前画面的最大记录号 -1 表示第一次
  hotIndex: -1, // 循环时需要定位当前数据的指针定位
  showCursorLine: false, // 是否显示光标信息
  moveIndex: -1, // 当前鼠标所在位置的记录号 -1 表示没有鼠标事件或第一次
  spaceX: 2, // 每个数据的间隔像素，可以根据实际情况变化，但不能系统参数里设定的spaceX小
  unitX: 5, // 每天数据的宽度 默认为5， 可以在1..50之间切换
  rightMode: 'no', // 除权模式
  hideInfo: false // 是否显示价格
}
/**
 * Class representing ClChart
 * @export
 * @class ClChart
 */
export default class ClChart {
  /**

   * Creates an instance of ClChart.
   * @param {Object} syscfg
   */
  constructor (syscfg) {
    this.context = syscfg.mainCanvas.context
    this.cursorCanvas = syscfg.cursorCanvas
    this.sysColor = syscfg.sysColor
    // Use this to determine if it is the root element
    this.father = undefined
  }
  /**
   * Re-initialize Chart to clean up all charts and data
   * @param {any} dataLayer data layer
   * @param {any} eventLayer event layer
   * @memberof ClChart
   */
  initChart (dataLayer, eventLayer) {
    // linkInfo 是所有子chart公用的参数集合，也是dataLayer应用的集合
    this.linkInfo = copyJsonOfDeep(DEFAULT_LINKINFO)
    // this.checkConfig();
    // 初始化子chart为空
    this.childCharts = {}
    // 设置数据层，同时对外提供设置接口
    this.setDataLayer(dataLayer)
    // 设置事件层，同时对外提供设置接口
    this.setEventLayer(eventLayer)
  }
  /**
   * clear current data and recharge linkinfo
   *
   * @memberof ClChart
   */
  clear () {
    this.fastDraw = false
    this.dataLayer.clearData()
    // this.eventLayer.clear();
  }
  /**
   * clear current data and recharge linkinfo
   *
   * @memberof ClChart
   */
  clearLayout () {
    this.childCharts = {}
    this.fastDraw = false
    this.dataLayer.clearData()
    // this.eventLayer.clear();
    this.linkInfo = copyJsonOfDeep(DEFAULT_LINKINFO)
  }
  /**
   * get child chart by key
   * @param {String} key child chart key
   * @return {Object} child chart
   * @memberof ClChart
   */
  getChart (key) {
    return this.childCharts[key]
  }

  // 以下是设置chart的事件关联接口，element表示映射的chart类
  // 所有事件由外部获取事件后传递到eventLayer后，再统一分发给相应的图表
  // eventLayer中有针对html5的鼠标键盘事件处理接口，其他事件处理接口另外再做

  /**
   * get event layer
   * @return {Object} event layer
   * @memberof ClChart
   */
  getEventLayer () {
    return this.eventLayer
  }
  setEventLayer (layer) {
    if (layer === undefined) return
    this.eventLayer = layer
    this.eventLayer.bindChart && this.eventLayer.bindChart(this) // 把chart绑定到事件处理层
  }
  // bindEvent (chart) {
  //   this.eventLayer.bindEvent(chart);
  // }

  /**
   * get data layer
   * @return {Object} data layer
   * @memberof ClChart
   */
  getDataLayer () {
    return this.dataLayer
  }
  /**
   * set data layer
   * @param {Object} layer
   * @memberof ClChart
   */
  setDataLayer (layer) {
    if (layer === undefined) return
    this.dataLayer = layer
    layer.father = this
    this.static = this.dataLayer.static
  }
  /**
   * Set the corresponding basic data key of the chart
   * @param {Object} chart
   * @param {String} key
   * @memberof ClChart
   */
  bindData (chart, key) {
    if (chart.hotKey !== key) {
      this.linkInfo.showMode = 'last' // 切换数据后需要重新画图
      this.linkInfo.minIndex = -1
      chart.hotKey = key // hotKey 针对chart的数据都调用该数据源
      this.fastDrawEnd() // 热点数据改变，就重新计算
    }
  }
  /**
   * init data
   * @param {Number} tradeDate trade date
   * @param {Number} tradetime  trade time
   * @memberof ClChart
   */
  initData (tradeDate, tradetime) {
    this.dataLayer.initData(tradeDate, tradetime)
  }
  /**
   * set data
   * @param {String} key data key
   * @param {Object} fields data field definition
   * @param {any} value
   * @memberof ClChart
   */
  setData (key, fields, value) {
    let info = value
    if (typeof value === 'string') info = JSON.parse(value)
    this.dataLayer.setData(key, fields, info)
    this.fastDrawEnd() // 新的数据被设置，就重新计算
  }
  /**
   * get data from datalayer by key
   * @param {String} key
   * @return {Array}
   * @memberof ClChart
   */
  getData (key) {
    if (this.fastDraw) {
      if (this.fastBuffer[key] !== undefined) {
        return this.fastBuffer[key]
      }
    }
    const out = this.dataLayer.getData(key, this.linkInfo.rightMode)
    if (this.fastDraw) {
      this.fastBuffer[key] = out
    }
    return out
  }
  /**
   * init line data
   * @param {Array} data
   * @param {Array} lines
   * @memberof ClChart
   */
  readyData (data, lines) {
    for (let k = 0; k < lines.length; k++) {
      if (lines[k].formula === undefined) continue
      if (!this.fastDraw || (this.fastDraw && this.fastBuffer[lines[k].formula.key] === undefined)) {
        this.dataLayer.makeLineData(
          { data, minIndex: this.linkInfo.minIndex, maxIndex: this.linkInfo.maxIndex },
          lines[k].formula.key,
          lines[k].formula.command
        )
      }
    }
  }
  /**
   * create chart
   * @param {String} name name is a unique name, the same name will override the previous class with the same name
   * @param {String} className class name
   * @param {Object} usercfg user custom config
   * @param {Function} callback callback
   * @return {Object} chart instance
   * @memberof ClChart
   */
  createChart (name, className, usercfg, callback) {
    let chart
    switch (className) {
      case 'CHART.ORDER': chart = new ClChartOrder(this); break
      case 'CHART.LINE': chart = new ClChartLine(this); break
      default : chart = new ClChartLine(this); break
    }

    chart.name = name
    this.childCharts[name] = chart

    // this.bindEvent(chart);
    chart.init(usercfg, callback) // 根据用户配置初始化信息框

    return chart
  }

  /**
   * draw all the layers contained in this area
   * @param {Object} chart
   * @memberof ClChart
   */
  onPaint (chart) {
    if (typeof this.context._beforePaint === 'function') {
      this.context._beforePaint()
    }
    this.fastDrawBegin()
    for (const key in this.childCharts) {
      console.log('onPaint', this.static)
      if (chart !== undefined) {
        if (this.childCharts[key] === chart) {
          this.childCharts[key].onPaint()
        }
      } else {
        this.childCharts[key].onPaint()
      }
    }
    // this.fastDrawEnd();
    if (typeof this.context._afterPaint === 'function') {
      this.context._afterPaint()
    }
  }
  /**
   * Used for the same group of multi-graph only take data once, this can speed up the display, the program structure will not be chaotic
   * @memberof ClChart
   */
  fastDrawBegin () {
    if (!this.fastDraw) {
      this.fastBuffer = []
      this.fastDraw = true
    }
  }
  /**
   * set whether to turn on quick drawing
   * @memberof ClChart
   */
  fastDrawEnd () {
    this.fastDraw = false
  }

  /**
   * Set whether to hide the information bar
   * @param {String} isHideInfo
   * @memberof ClChart
   */
  setHideInfo (isHideInfo) {
    if (isHideInfo === undefined) return
    if (isHideInfo !== this.linkInfo.hideInfo) {
      this.linkInfo.hideInfo = isHideInfo
      this.onPaint()
    }
  }
  /**
   * Set the background color
   * @param {String} sysColor
   * @param {Object | null} chart
   * @memberof ClChart
   */
  setColor (sysColor, chart) {
    this.color = setColor(sysColor)
    if (chart === undefined) chart = this
    for (const key in chart.childCharts) {
      chart.childCharts[key].color = this.color
      this.setColor(sysColor, chart.childCharts[key])
    }
    // 需要将其子配置的颜色也一起改掉
    for (const key in chart.childDraws) {
      chart.childDraws[key].color = this.color
      this.setColor(sysColor, chart.childDraws[key])
    }
    for (const key in chart.childLines) {
      chart.childLines[key].color = this.color
      this.setColor(sysColor, chart.childLines[key])
    }
    this.sysColor = sysColor
  }
  /**
   * setting drafting standards
   * @param {String} standard
   * @memberof ClChart
   */
  setStandard (standard) {
    setStandard(standard)
    this.setColor(this.sysColor)
    this.onPaint()
  }
  // this.makeLineData = function(data, key, formula, punit) {
  //   return this.dataLayer.makeLineData(data, key, this.linkInfo.minIndex, this.linkInfo.maxIndex, formula);
  // }
}
