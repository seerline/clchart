/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

//   画Reports

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
  copyJsonOfDeep,
  offsetRect
} from '../util/cl.tool'
import {
  initCommonInfo,
  checkLayout
} from './cl.chart.init'
import {
  CHART_LAYOUT
} from '../cl.chart.def'
import getValue from '../data/cl.data.tools'

/**
 * Class representing ClChartReport
 * @export
 * @class ClChartReport
 */
export default class ClChartReport {
  /**

   * Creates an instance of ClChartReport.
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
   * @memberof ClChartReport
   */
  init (cfg) {
    this.rectMain = cfg.rectMain || { left: 0, top: 0, width: 200, height: 300 }
    this.layout = updateJsonOfDeep(cfg.layout, CHART_LAYOUT)

    this.config = copyJsonOfDeep(cfg.config)

    this.style = cfg.config.style || 'normal'
    // 下面对配置做一定的校验
    this.checkConfig()
    // 再做一些初始化运算，下面的运算范围是初始化设置后基本不变的数据
    this.setPublicRect()
  }
  /**
   * check config
   * @memberof ClChartReport
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
   * @memberof ClChartReport
   */
  setPublicRect () {
    this.rectChart = offsetRect(this.rectMain, this.layout.margin)
  }
  /**
   * handle click event
   * @memberof ClChartReport
   */
  onClick (/* e */) {
    if (this.isIndex) return // 如果是指数就啥也不干
    if (this.style === 'normal') {
      this.style = 'large'
    } else {
      this.style = 'normal'
    }
    this.father.onPaint(this)
  }
  /**
   * paint order chart
   * @memberof ClChartReport
   */
  onPaint () {
    this.reportData = this.father.getData('reports')
    if (this.reportData === undefined) return;
    this.reportData.coindot = this.static.coindot

    _setLineWidth(this.context, this.scale)
    this.drawClear() // 清理画图区
    this.drawReady() // 数据准备

    this.drawReports()

  }
  /**
   * clear chart
   * @memberof ClChartReport
   */
  drawClear () {
    _fillRect(this.context, this.rectMain.left, this.rectMain.top, this.rectMain.width, this.rectMain.height, this.color.back)
  }
  /**
   * set ready for draw
   * @memberof ClChartReport
   */
  drawReady () {
    this.rectReport = {
      left: this.rectChart.left,
      top: this.rectChart.top,
      width: this.rectChart.width,
      height: this.rectChart.height
    }
  }
  /**
   * get color by close and before data
   * @param {Number} close
   * @param {Number} before
   * @return {String} color
   * @memberof ClChartReport
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
   * draw report
   * @memberof ClChartReport
   */
  drawReports () {
    if (this.reportData === undefined || this.reportData.value.length < 1) return
    const maxlines = Math.floor(this.rectReport.height / this.layout.digit.height) - 1 // 屏幕最大能显示多少条记录
    const recs = this.reportData.value.length
    const beginIndex = recs > maxlines ? recs - maxlines : 0
    const offy = this.rectReport.height / maxlines

    let xx, yy
    let value, clr
    let offx = (this.rectReport.width - 4 * this.layout.digit.spaceX - this.timeLen - this.closeLen - this.volLen) / 2
    if (this.isIndex) offx = (this.rectReport.width - 3 * this.layout.digit.spaceX - this.timeLen - this.closeLen) / 2

    yy = this.rectReport.top + 2 + Math.floor((offy - this.layout.digit.pixel) / 2) // 画最上面的
    // for (let idx = recs - 1; idx >= beginIndex; idx--) {
    for (let idx = beginIndex; idx < recs; idx++) {
      xx = this.rectReport.left + this.layout.digit.spaceX + this.timeLen
      value = getValue(this.reportData, 'time', idx)
      clr = this.color.txt
      let str
      if (idx === beginIndex) {
        str = fromTTimeToStr(value, 'minute')
      } else {
        str = fromTTimeToStr(value, 'minute', getValue(this.reportData, 'time', idx - 1))
      }
      _drawTxt(this.context, xx, yy, str,
        this.layout.digit.font, this.layout.digit.pixel, clr, {
          x: 'end'
        })

      if (this.isIndex) {
        xx = this.rectReport.left + this.rectReport.width - this.layout.digit.spaceX

        value = getValue(this.reportData, 'price', idx)
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
        value = getValue(this.reportData, 'price', idx)
        clr = this.getColor(value, this.static.before)
        _drawTxt(this.context, xx, yy, formatPrice(value, this.static.coindot),
          this.layout.digit.font, this.layout.digit.pixel, clr, {
            x: 'end'
          })
      }
      xx += offx + this.volLen + this.layout.digit.spaceX

      value = getValue(this.reportData, 'vol', idx)
      clr = this.color.vol
      _drawTxt(this.context, xx, yy, formatVolume(value, this.static.volunit),
        this.layout.digit.font, this.layout.digit.pixel, clr, {
          x: 'end'
        })

      yy += offy
    }
  }
}
