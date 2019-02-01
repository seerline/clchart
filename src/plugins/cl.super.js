/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  _fillRect,
  _drawRect,
  _drawHline,
  _setLineWidth,
  _drawTxt,
  _getTxtWidth,
  _drawBegin,
  _drawEnd
} from '../util/cl.draw'
import {
  fromTTimeToStr,
  formatVolume,
  formatPrice,
  updateJsonOfDeep,
  offsetRect
} from '../util/cl.tool'
import {
  initCommonInfo,
  checkLayout
} from '../chart/cl.chart.init'
import {
  CHART_LAYOUT
} from '../cl.chart.def'
import getValue from '../data/cl.data.tools'

export const CHART_SUPER = {
  style: 'snapshot', // 'order' || 'snapshot' || 'queue'
  // animate : true,   // 
}

/**
 * Class representing ClChartSuper
 * @export
 * @class ClChartSuper
 */
export default class ClChartSuper {
  /**

   * Creates an instance of ClChartSuper.
   * @param {Object} father order chart's parent context
   */
  constructor (father) {
    initCommonInfo(this, father)
    this.linkInfo = father.linkInfo
    this.static = this.father.dataLayer.static
  }
  /**
   * init order chart
   * @param {Object} cfg
   * @memberof ClChartSuper
   */
  init (cfg) {
    this.rectMain = cfg.rectMain || { left: 0, top: 0, width: 200, height: 300 }
    this.layout = updateJsonOfDeep(cfg.layout, CHART_LAYOUT)

    this.config = updateJsonOfDeep(cfg.config, CHART_SUPER)

    this.style = this.config.style || 'snapshot'
    // 下面对配置做一定的校验
    this.checkConfig()
    // 再做一些初始化运算，下面的运算范围是初始化设置后基本不变的数据
    this.setPublicRect()
  }
  /**
   * check config
   * @memberof ClChartSuper
   */
  checkConfig () { // 检查配置有冲突的修正过来
    checkLayout(this.layout)
    this.txtLen = _getTxtWidth(this.context, '涨', this.layout.digit.font, this.layout.digit.pixel)
    this.timeLen = _getTxtWidth(this.context, '15:30', this.layout.digit.font, this.layout.digit.pixel)
    this.volLen = _getTxtWidth(this.context, '888888', this.layout.digit.font, this.layout.digit.pixel)
    this.closeLen = _getTxtWidth(this.context, '888.88', this.layout.digit.font, this.layout.digit.pixel)
  }
  /**
   * Calculate all rectangular areas
   * @memberof ClChartSuper
   */
  setPublicRect () {
    this.rectChart = offsetRect(this.rectMain, this.layout.margin)
  }
  /**
   * handle click event
   * @memberof ClChartSuper
   */
  onClick (/* e */) {
    this.father.onPaint(this)
  }
  /**
   * paint order chart
   * @memberof ClChartSuper
   */
  onPaint () {
    _setLineWidth(this.context, this.scale)
    this.drawClear() // 清理画图区
    this.drawReady() // 数据准备

    this.drawSuperBoard()
  }
  /**
   * clear chart
   * @memberof ClChartSuper
   */
  drawClear () {
    _fillRect(this.context, this.rectMain.left, this.rectMain.top, this.rectMain.width, this.rectMain.height, this.color.back)
  }
  /**
   * set ready for draw
   * @memberof ClChartSuper
   */
  drawReady () {

  }
  /**
   * get color by close and before data
   * @param {Number} close
   * @param {Number} before
   * @return {String} color
   * @memberof ClChartSuper
   */
  getColor (close, before) {
    if (close > before) {
      return this.color.red
    } else if (close < before) {
      return this.color.green
    } else {
      return this.color.white
    }
  }
  
  /**
   * draw order
   * @memberof ClChartSuper
   */
  drawSuperBoard () {
    this.orderData = this.father.getData('snapshot')
    this.orderData.coindot = this.static.coindot
    this.static.volzoom = 100
    
    
    const xpos = this.drawGridLine() // 先画线格
    if (this.orderData === undefined || this.orderData.value.length < 1) {
      return
    }
    const offx = (this.rectChart.width - xpos - 2 * this.layout.digit.spaceX - this.closeLen - this.volLen) / 2

    let mmpCount = 10
    const offy = this.rectChart.height / (mmpCount * 2)

    let xx, yy
    let value, clr

    yy = this.rectChart.top + Math.floor((offy - this.layout.digit.height) / 2) // 画最上面的
    for (let idx = mmpCount; idx >= 1; idx--) {
      xx = this.rectChart.left + xpos + offx + this.closeLen
      if (!this.linkInfo.hideInfo) {
        value = getValue(this.orderData, 'bidp' + idx)
        clr = this.getColor(value, this.static.before)
        _drawTxt(this.context, xx, yy, formatPrice(value, this.static.coindot),
          this.layout.digit.font, this.layout.digit.pixel, clr, {
            x: 'end'
          })
      }

      xx += offx + this.volLen + this.layout.digit.spaceX
      value = getValue(this.orderData, 'bidv' + idx)
      clr = this.color.vol
      _drawTxt(this.context, xx, yy, formatVolume(value, this.static.volzoom),
        this.layout.digit.font, this.layout.digit.pixel, clr, {
          x: 'end'
        })

      yy += offy
    }
    for (let idx = 1; idx <= mmpCount; idx++) {
      xx = this.rectChart.left + xpos + offx + this.closeLen
      if (!this.linkInfo.hideInfo) {
        value = getValue(this.orderData, 'askp' + idx)
        clr = this.getColor(value, this.static.before)
        _drawTxt(this.context, xx, yy, formatPrice(value, this.static.coindot),
          this.layout.digit.font, this.layout.digit.pixel, clr, {
            x: 'end'
          })
      }
      xx += offx + this.volLen + this.layout.digit.spaceX
      value = getValue(this.orderData, 'askv' + idx)
      clr = this.color.vol
      _drawTxt(this.context, xx, yy, formatVolume(value, this.static.volzoom),
        this.layout.digit.font, this.layout.digit.pixel, clr, {
          x: 'end'
        })

      yy += offy
    }
  }
  /**
   * draw tick
   * @memberof ClChartSuper
   */
  drawOrder () 
  {
    if (this.tickData === undefined || this.tickData.value.length < 1) return
    const maxlines = Math.floor(this.rectTick.height / this.layout.digit.height) - 1 // 屏幕最大能显示多少条记录
    const recs = this.tickData.value.length
    const beginIndex = recs > maxlines ? recs - maxlines : 0
    const offy = this.rectTick.height / maxlines

    let xx, yy
    let value, clr
    let offx = (this.rectTick.width - 4 * this.layout.digit.spaceX - this.timeLen - this.closeLen - this.volLen) / 2
    if (this.isIndex) offx = (this.rectTick.width - 3 * this.layout.digit.spaceX - this.timeLen - this.closeLen) / 2

    yy = this.rectTick.top + 2 + Math.floor((offy - this.layout.digit.pixel) / 2) // 画最上面的
    for (let idx = recs - 1; idx >= beginIndex; idx--) {
      // for (let idx = beginIndex; idx < recs; idx++) {
      xx = this.rectTick.left + this.layout.digit.spaceX + this.timeLen
      value = getValue(this.tickData, 'time', idx)
      clr = this.color.txt
      let str
      if (idx === 0) {
        str = fromTTimeToStr(value, 'minute')
      } else {
        str = fromTTimeToStr(value, 'minute', getValue(this.tickData, 'time', idx - 1))
      }
      _drawTxt(this.context, xx, yy, str,
        this.layout.digit.font, this.layout.digit.pixel, clr, {
          x: 'end'
        })

      if (this.isIndex) {
        xx = this.rectTick.left + this.rectTick.width - this.layout.digit.spaceX

        value = getValue(this.tickData, 'close', idx)
        clr = this.getColor(value, this.static.before)
        _drawTxt(this.context, xx, yy, formatPrice(value, this.static.coindot),
          this.layout.digit.font, this.layout.digit.pixel, clr, {
            x: 'end'
          })
        yy += offy
        continue
      }
      xx += offx + this.closeLen + this.layout.digit.spaceX

      if (!this.linkInfo.hideInfo) {
        value = getValue(this.tickData, 'close', idx)
        clr = this.getColor(value, this.static.before)
        _drawTxt(this.context, xx, yy, formatPrice(value, this.static.coindot),
          this.layout.digit.font, this.layout.digit.pixel, clr, {
            x: 'end'
          })
      }
      xx += offx + this.volLen + this.layout.digit.spaceX

      value = getValue(this.tickData, 'decvol', idx)
      clr = this.color.vol
      _drawTxt(this.context, xx, yy, formatVolume(value, this.static.volzoom),
        this.layout.digit.font, this.layout.digit.pixel, clr, {
          x: 'end'
        })

      yy += offy
    }
  }
  /**
   * draw grid line
   * @return {Number}
   * @memberof ClChartSuper
   */
  drawGridLine () {
    _drawBegin(this.context, this.color.grid)
    _drawRect(this.context, this.rectMain.left, this.rectMain.top, this.rectMain.width, this.rectMain.height)

    let mmpCount = 10

    let len = 0
    _drawHline(this.context, this.rectChart.left, this.rectChart.left + this.rectChart.width, this.rectChart.top + Math.floor(this.rectChart.height / 2))

    let xx, yy, value
    const strint = ['①', '②', '③', '④', '⑤','⑥','⑦','⑧','⑨','⑩']
    const offy = this.rectChart.height / (mmpCount * 2)

    len = _getTxtWidth(this.context, '卖①', this.layout.title.font, this.layout.title.height)
    yy = this.rectChart.top + Math.floor((offy - this.layout.title.pixel) / 2) // 画最上面的
    for (let idx = mmpCount - 1; idx >= 0; idx--) {
      xx = this.rectChart.left + this.layout.title.spaceX
      value = '卖' + strint[idx]
      _drawTxt(this.context, xx, yy, value,
        this.layout.title.font, this.layout.title.pixel, this.color.txt)
      yy += offy
    }
    for (let idx = 0; idx < mmpCount; idx++) {
      xx = this.rectChart.left + this.layout.title.spaceX
      value = '买' + strint[idx]
      _drawTxt(this.context, xx, yy, value,
        this.layout.title.font, this.layout.title.pixel, this.color.txt)
      yy += offy
    }
    _drawEnd(this.context)
    return len
  }
}
