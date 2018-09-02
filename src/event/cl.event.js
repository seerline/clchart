/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// 定义事件监听接口

// 鼠标事件
//  onMouseMove // 移动
//  onMouseIn  // 进入
//  monMouseOut // 离开
//  onMousewheel // 滚动
//  onMouseUp  //
//  onMouseDown //
// 键盘事件
//  onKeyUp
//  onKeyDown
// 触摸事件
//  onTouchStart // 触摸开始
//  onTouchEnd   // 触摸结束
//  onTouchMove  // 触摸移动
// 其他事件
//  onClick // 点击
//  onLongPress // 长按
//  onPinch // 两指放大或缩小
//  onRotate // 旋转
//  onSwipe //左滑或右滑
import {
  copyJsonOfDeep,
  inRect
} from '../util/cl.tool'
import ClEventHandler from './cl.event.handler'

export const EVENT_DEFINE = [
  'onMouseMove',
  // 'onMouseIn',
  'onMouseOut',
  'onMousewheel',
  'onMouseUp',
  'onMouseDown',
  'onKeyUp',
  'onKeyDown',
  'onClick',
  'onDoubleClick',
  'onLongPress',
  'onPinch',
  'onRotate',
  'onSwipe'
]

export function buildMinaTouchEvent (e) {
  const eventObj = {}
  if (e && Array.isArray(e.touches)) {
    eventObj.touches = []
    for (let i = 0; i < e.touches.length; i++) {
      const point = e.touches[i]
      eventObj.touches.push({
        pageX: point.x,
        pageY: point.y,
        offsetX: point.x,
        offsetY: point.y
      })
    }
  }
  if (e && Array.isArray(e.changedTouches)) {
    eventObj.changedTouches = []
    for (let i = 0; i < e.changedTouches.length; i++) {
      const point = e.changedTouches[i]
      eventObj.changedTouches.push({
        pageX: point.x,
        pageY: point.y,
        offsetX: point.x,
        offsetY: point.y
      })
    }
  }
  return eventObj
}

/**
 * Class representing ClEvent
 * @export
 * @class ClEvent
 */
export default class ClEvent {
  /**
   * Creates an instance of ClEvent.
   * @param {Object} syscfg
   * @constructor
   */
  constructor (syscfg) {
    // this.eventCanvas = syscfg.mainCanvas.canvas // 对web来说就是虚拟接收事件的canvas
    this.eventCanvas = syscfg.cursorCanvas.canvas
    this.eventPlatform = syscfg.eventPlatform || 'web'
    this.scale = syscfg.scale

    const eventCfg = {
      father: this
    }
    if (this.eventPlatform === 'react-native') {
      eventCfg.isTouch = true
    } else if (this.eventPlatform === 'web') {
      eventCfg.isTouch = 'ontouchend' in document
    } else if (this.eventPlatform === 'mina') {
      eventCfg.isTouch = true
      eventCfg.eventBuild = buildMinaTouchEvent
    }
    this.eventSource = new ClEventHandler(eventCfg)
    this.eventSource.bindEvent()
  }
  // 只需要绑定一个原始ClChart就可以了，子图的事件通过childCharts来判断获取
  // 每个chart如果自己定义了对应事件就会分发，未定义不分发，分发后以返回值判断是否继续传递到下一个符合条件的chart
  /**
   * bind event
   * @param {Object} source
   * @memberof ClEvent
   */
  bindChart (source) {
    this.firstChart = source
    this.HotWin = undefined
  }
  /**
   * clear event
   * @memberof ClEvent
   */
  clearEvent () {
    this.eventSource.clearEvent()
  }
  // 下面是接收事件后,根据热点位置来判断归属于哪一个chart,并分发事件;
  // config 必须包含鼠标位置 {offsetX:offsetY:}
  /**
   * emit event
   * @param {String} eventName
   * @param {Object} config
   * @memberof ClEvent
   */
  emitEvent (eventName, config) {
    // .....这里需要特殊分解处理Out的事件
    if (eventName === 'onMouseOut' || eventName === 'onMouseMove') {
      this.boardEvent(this.firstChart, eventName, config)
      this.HotWin = undefined
      return
    }
    const mousePos = this.getMousePos(config)
    const chartPath = []
    for (const name in this.firstChart.childCharts) {
      // 判断鼠标在哪个区域
      if (inRect(this.firstChart.childCharts[name].rectMain, mousePos)) {
        // 取得事件冒泡顺序
        this.findEventPath(chartPath, this.firstChart.childCharts[name], mousePos)
        // 只处理符合条件的一个区域，重叠区域不考虑
        break
      }
    }
    if (chartPath.length < 1) return
    // 继承最初始的传入参数,从最顶层开始处理
    const event = copyJsonOfDeep(config)
    for (let k = chartPath.length - 1; k >= 0; k--) {
      if (chartPath[k][eventName] !== undefined) {
        // 这里生成一个相对鼠标位置
        event.mousePos = {
          // x: mousePos.x - chartPath[k].rectMain.left,
          // y: mousePos.y - chartPath[k].rectMain.top
          x: mousePos.x,
          y: mousePos.y
        }
        // 执行事件函数
        chartPath[k][eventName](event)
        if (event.break) break // 跳出循环
      }
    }
  }
  // 用于鼠标联动时，向childCharts同一级别画图区域广播事件
  //
  /**
   * board event
   * @param {Object} chart
   * @param {String} eventName
   * @param {Object} config
   * @param {Object} ignore
   * @memberof ClEvent
   */
  boardEvent (chart, eventName, config, ignore) {
    const event = copyJsonOfDeep(config)
    const mousePos = this.getMousePos(config)

    for (const name in chart.childCharts) {
      if (chart.childCharts[name] === ignore) continue
      if (chart.childCharts[name][eventName] === undefined) continue

      event.mousePos = {
        // x: mousePos.x - chart.childCharts[name].rectMain.left,
        // y: mousePos.y - chart.childCharts[name].rectMain.top
        x: mousePos.x,
        y: mousePos.y
      }
      chart.childCharts[name][eventName](event)
      if (event.break) break
    }
  }
  /**
   * find event path
   * @param {Array} path
   * @param {Object} chart
   * @param {Object} mousePos
   * @memberof ClEvent
   */
  findEventPath (path, chart, mousePos) {
    path.push(chart)
    if (chart.childCharts === undefined) return

    for (const name in chart.childCharts) {
      if (inRect(chart.childCharts[name].rectMain, mousePos)) {
        this.findEventPath(path, chart.childCharts[name], mousePos)
      }
    }
  }
  /**
   * get mouse position info
   * @param {Object} event
   * @return {Object} mouse position info
   * @memberof ClEvent
   */
  getMousePos (event) {
    const mouseX = event.offsetX * this.scale
    const mouseY = event.offsetY * this.scale
    return {
      x: mouseX,
      y: mouseY
    }
  }
}
