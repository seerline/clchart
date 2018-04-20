'use strict'

// ////////////////////////////////////////////////////////////////
//   画买卖盘
// ///////////////////////////////////////////////////////////////
// 画买卖盘和Tick

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
import { CHART_LAYOUT, CHART_ORDER } from '../cl.chart.def'
import getValue from '../data/cl.data.tools'
import {
  FIELD_NOW,
  FIELD_NOW_IDX,
  FIELD_TICK
} from '../data/../cl.data.def'

export default function ClChartOrder (father) {
  initCommonInfo(this, father)

  this.linkInfo = father.linkInfo
  this.static = this.father.dataLayer.static
  // ////////////////////////////////////////////////////////////////
  //   程序入口程序，以下都是属于设置类函数，基本不需要修改，
  // ///////////////////////////////////////////////////////////////
  this.init = function (cfg) {
    this.rectMain = cfg.rectMain || { left: 0, top: 0, width: 200, height: 300 }
    this.layout = updateJsonOfDeep(cfg.layout, CHART_LAYOUT)

    this.config = updateJsonOfDeep(cfg.config, CHART_ORDER)

    this.style = cfg.config.style || 'normal'
    // 下面对配置做一定的校验
    this.checkConfig()
    // 再做一些初始化运算，下面的运算范围是初始化设置后基本不变的数据
    this.setPublicRect()
  }

  this.checkConfig = function () { // 检查配置有冲突的修正过来
    checkLayout(this.layout)
    this.txtLen = _getTxtWidth(this.context, '涨', this.layout.digit.font, this.layout.digit.pixel)
    this.timeLen = _getTxtWidth(this.context, '15:30', this.layout.digit.font, this.layout.digit.pixel)
    this.volLen = _getTxtWidth(this.context, '888888', this.layout.digit.font, this.layout.digit.pixel)
    this.closeLen = _getTxtWidth(this.context, '888.88', this.layout.digit.font, this.layout.digit.pixel)
  }
  this.setPublicRect = function () { // 计算所有矩形区域
    this.rectChart = offsetRect(this.rectMain, this.layout.margin)
  }

  // //////////
  //
  // ///////////
  this.onClick = function (/* e */) {
    if (this.isIndex) return // 如果是指数就啥也不干
    if (this.style === 'normal') {
      this.style = 'tiny'
    } else {
      this.style = 'normal'
    }
    this.father.onPaint(this)
  }
  // 事件监听
  this.onPaint = function () { // 重画
    this.codeInfo = this.father.getData('INFO')
    this.orderData = this.father.getData('NOW')
    this.tickData = this.father.getData('TICK')
    if (this.orderData === undefined || this.tickData === undefined) return
    this.orderData.coinunit = this.static.coinunit
    this.tickData.coinunit = this.static.coinunit
    this.isIndex = getValue(this.codeInfo, 'type') === 0

    _setLineWidth(this.context, this.scale)
    this.drawClear() // 清理画图区
    this.drawReady() // 数据准备

    if (this.isIndex) {
      this.drawIndex()
    } else {
      this.drawOrder()
    }
    this.drawTick()
  }

  // ////////////////////////////////////////////////////////////////
  //   绘图函数
  // ///////////////////////////////////////////////////////////////
  this.drawClear = function () {
    _fillRect(this.context, this.rectMain.left, this.rectMain.top, this.rectMain.width, this.rectMain.height, this.color.back)
  }
  this.drawReady = function () {
    if (this.tickData === undefined) {
      this.tickData = { key: 'TICK', fields: FIELD_TICK, value: [] }
    }
    if (this.orderData === undefined) {
      this.orderData = { key: 'NOW', fields: FIELD_NOW, value: [] }
    }
    let yy
    if (this.style === 'normal') {
      yy = this.rectChart.top + (this.layout.digit.height + this.layout.digit.spaceX) * 10
    } else {
      yy = this.rectChart.top + (this.layout.digit.height + this.layout.digit.spaceX) * 2
    }
    if (this.isIndex) {
      yy = this.rectChart.top + (this.layout.digit.height + this.layout.digit.spaceX) * 4
      this.rectOrder = {
        left: this.rectChart.left,
        top: this.rectChart.top,
        width: this.rectChart.width,
        height: yy
      }
    } else {
      this.rectOrder = {
        left: this.rectChart.left,
        top: this.rectChart.top,
        width: this.rectChart.width,
        height: yy
      }
    }
    if (this.config.title.display !== 'none') {
      this.rectTitle = {
        left: this.rectChart.left,
        top: yy,
        width: this.rectChart.width,
        height: this.layout.title.height
      }
    } else {
      this.rectTitle = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
    }
    yy += this.rectTitle.height
    this.rectTick = {
      left: this.rectChart.left,
      top: yy,
      width: this.rectChart.width,
      height: this.rectChart.height - yy - this.layout.digit.height / 2
    }
  }
  this.getColor = function (close, before) {
    if (close > before) {
      return this.color.red
    } else if (close < before) {
      return this.color.green
    } else {
      return this.color.white
    }
  }
  this.drawIndex = function () {
    _drawBegin(this.context, this.color.grid)
    _drawRect(this.context, this.rectMain.left, this.rectMain.top, this.rectMain.width, this.rectMain.height)

    const offy = this.rectOrder.height / 3
    const offx = this.rectOrder.width / 3
    let xx, yy, len
    let value

    yy = this.rectOrder.top + Math.floor((offy - this.layout.digit.height) / 2) // 画最上面的

    xx = this.rectOrder.left + (offx - this.txtLen) / 2
    _drawTxt(this.context, xx, yy, '涨', this.layout.digit.font, this.layout.digit.pixel, this.color.txt)
    xx = this.rectOrder.left + offx + (offx - this.txtLen) / 2
    _drawTxt(this.context, xx, yy, '跌', this.layout.digit.font, this.layout.digit.pixel, this.color.txt)
    xx = this.rectOrder.left + 2 * offx + (offx - this.txtLen) / 2
    _drawTxt(this.context, xx, yy, '平', this.layout.digit.font, this.layout.digit.pixel, this.color.txt)

    const inow = { key: 'NOW', fields: FIELD_NOW_IDX, value: this.orderData.value }
    yy = this.rectOrder.top + offy + Math.floor((offy - this.layout.digit.height) / 2) // 画最上面的
    value = formatVolume(getValue(inow, 'ups'))
    len = _getTxtWidth(this.context, value, this.layout.digit.font, this.layout.digit.pixel)
    xx = this.rectOrder.left + (offx - len) / 2
    _drawTxt(this.context, xx, yy, value, this.layout.digit.font, this.layout.digit.pixel, this.color.txt)

    value = formatVolume(getValue(inow, 'downs'))
    len = _getTxtWidth(this.context, value, this.layout.digit.font, this.layout.digit.pixel)
    xx = this.rectOrder.left + offx + (offx - len) / 2
    _drawTxt(this.context, xx, yy, value, this.layout.digit.font, this.layout.digit.pixel, this.color.txt)

    value = formatVolume(getValue(inow, 'mids'))
    len = _getTxtWidth(this.context, value, this.layout.digit.font, this.layout.digit.pixel)
    xx = this.rectOrder.left + 2 * offx + (offx - len) / 2
    _drawTxt(this.context, xx, yy, value, this.layout.digit.font, this.layout.digit.pixel, this.color.txt)

    yy = this.rectOrder.top + 2 * offy + Math.floor((offy - this.layout.digit.height) / 2)

    value = formatVolume(getValue(inow, 'upvol'))
    len = _getTxtWidth(this.context, value, this.layout.digit.font, this.layout.digit.pixel)
    xx = this.rectOrder.left + (offx - len) / 2
    _drawTxt(this.context, xx, yy, value, this.layout.digit.font, this.layout.digit.pixel, this.color.txt)

    value = formatVolume(getValue(inow, 'downvol'))
    len = _getTxtWidth(this.context, value, this.layout.digit.font, this.layout.digit.pixel)
    xx = this.rectOrder.left + offx + (offx - len) / 2
    _drawTxt(this.context, xx, yy, value, this.layout.digit.font, this.layout.digit.pixel, this.color.txt)

    if (this.config.title.display !== 'none') {
      _drawHline(this.context, this.rectTitle.left, this.rectTitle.left + this.rectTitle.width, this.rectTitle.top)
      _drawHline(this.context, this.rectTitle.left, this.rectTitle.left + this.rectTitle.width, this.rectTitle.top + this.rectTitle.height)
      const ticklen = _getTxtWidth(this.context, '分时成交', this.layout.title.font, this.layout.digit.pixel)
      xx = this.rectTitle.left + (this.rectTitle.width - ticklen) / 2
      yy = this.rectTitle.top + 3 * this.scale
      _drawTxt(this.context, xx, yy, '分时成交',
        this.layout.digit.font, this.layout.digit.pixel, this.color.txt)
    }
    _drawEnd(this.context)
  }
  this.drawOrder = function () {
    const xpos = this.drawGridLine() // 先画线格
    if (this.orderData === undefined || this.orderData.value.length < 1) {
      return
    }
    const offx = (this.rectOrder.width - xpos - 2 * this.layout.digit.spaceX - this.closeLen - this.volLen) / 2

    let mmpCount = 1
    if (this.style === 'normal') {
      mmpCount = 5
    }
    const offy = this.rectOrder.height / (mmpCount * 2)

    let xx, yy
    let value, clr

    yy = this.rectOrder.top + Math.floor((offy - this.layout.digit.height) / 2) // 画最上面的
    for (let idx = mmpCount; idx >= 1; idx--) {
      xx = this.rectOrder.left + xpos + offx + this.closeLen
      if (!this.linkInfo.hideInfo) {
        value = getValue(this.orderData, 'sell' + idx)
        clr = this.getColor(value, this.static.before)
        _drawTxt(this.context, xx, yy, formatPrice(value, this.static.decimal),
          this.layout.digit.font, this.layout.digit.pixel, clr, {
            x: 'end'
          })
      }

      xx += offx + this.volLen + this.layout.digit.spaceX
      value = getValue(this.orderData, 'sellvol' + idx)
      clr = this.color.vol
      _drawTxt(this.context, xx, yy, formatVolume(value, 100),
        this.layout.digit.font, this.layout.digit.pixel, clr, {
          x: 'end'
        })

      yy += offy
    }
    for (let idx = 1; idx <= mmpCount; idx++) {
      xx = this.rectOrder.left + xpos + offx + this.closeLen
      if (!this.linkInfo.hideInfo) {
        value = getValue(this.orderData, 'buy' + idx)
        clr = this.getColor(value, this.static.before)
        _drawTxt(this.context, xx, yy, formatPrice(value, this.static.decimal),
          this.layout.digit.font, this.layout.digit.pixel, clr, {
            x: 'end'
          })
      }
      xx += offx + this.volLen + this.layout.digit.spaceX
      value = getValue(this.orderData, 'buyvol' + idx)
      clr = this.color.vol
      _drawTxt(this.context, xx, yy, formatVolume(value, 100),
        this.layout.digit.font, this.layout.digit.pixel, clr, {
          x: 'end'
        })

      yy += offy
    }
  }
  this.drawTick = function () {
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
        _drawTxt(this.context, xx, yy, formatPrice(value, this.static.decimal),
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
        _drawTxt(this.context, xx, yy, formatPrice(value, this.static.decimal),
          this.layout.digit.font, this.layout.digit.pixel, clr, {
            x: 'end'
          })
      }
      xx += offx + this.volLen + this.layout.digit.spaceX

      value = getValue(this.tickData, 'decvol', idx)
      clr = this.color.vol
      _drawTxt(this.context, xx, yy, formatVolume(value, 100),
        this.layout.digit.font, this.layout.digit.pixel, clr, {
          x: 'end'
        })

      yy += offy
    }
  }

  this.drawGridLine = function () {
    _drawBegin(this.context, this.color.grid)
    _drawRect(this.context, this.rectMain.left, this.rectMain.top, this.rectMain.width, this.rectMain.height)

    let mmpCount = 1
    if (this.style === 'normal') {
      mmpCount = 5
    }
    let len = 0
    _drawHline(this.context, this.rectOrder.left, this.rectOrder.left + this.rectOrder.width, this.rectOrder.top + Math.floor(this.rectOrder.height / 2))

    let xx, yy, value
    const strint = ['①', '②', '③', '④', '⑤']
    const offy = this.rectOrder.height / (mmpCount * 2)

    len = _getTxtWidth(this.context, '卖①', this.layout.title.font, this.layout.digit.height)
    yy = this.rectOrder.top + Math.floor((offy - this.layout.digit.pixel) / 2) // 画最上面的
    for (let idx = mmpCount - 1; idx >= 0; idx--) {
      xx = this.rectOrder.left + this.layout.digit.spaceX
      value = '卖' + strint[idx]
      _drawTxt(this.context, xx, yy, value,
        this.layout.digit.font, this.layout.digit.pixel, this.color.txt)
      yy += offy
    }
    for (let idx = 0; idx < mmpCount; idx++) {
      xx = this.rectOrder.left + this.layout.digit.spaceX
      value = '买' + strint[idx]
      _drawTxt(this.context, xx, yy, value,
        this.layout.digit.font, this.layout.digit.pixel, this.color.txt)
      yy += offy
    }
    if (this.config.title.display !== 'none') {
      _drawHline(this.context, this.rectTitle.left, this.rectTitle.left + this.rectTitle.width, this.rectTitle.top)
      _drawHline(this.context, this.rectTitle.left, this.rectTitle.left + this.rectTitle.width, this.rectTitle.top + this.rectTitle.height)
      if (this.style === 'normal') {
        value = '分时成交 △'
      } else {
        value = '分时成交 ▽'
      }
      const ticklen = _getTxtWidth(this.context, value, this.layout.title.font, this.layout.digit.pixel)
      xx = this.rectTitle.left + (this.rectTitle.width - ticklen) / 2
      yy = this.rectTitle.top + 3 * this.scale
      _drawTxt(this.context, xx, yy, value,
        this.layout.digit.font, this.layout.digit.pixel, this.color.txt)
    }
    _drawEnd(this.context)
    return len
  }
}
