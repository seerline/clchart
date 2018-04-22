'use strict'

// //////////////////////////////////////////////////
// 以下是 ClDrawCursor 的实体定义
// //////////////////////////////////////////////////

import {
  _getTxtWidth,
  _drawTxtRect,
  _clearRect,
  _drawLineAlone
} from '../util/cl.draw'
import {
  initCommonInfo
} from '../chart/cl.chart.init'
import {
  inRangeX,
  inRangeY,
  formatShowTime,
  formatInfo
} from '../util/cl.tool'
// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawCursor (father, rectMain, rectChart) {
  initCommonInfo(this, father)
  this.rectFather = father.rectMain
  this.rectMain = rectMain // 画十字线和边界标签
  this.rectChart = rectChart // 鼠标有效区域

  this.linkInfo = father.father.linkInfo
  this.static = father.static

  this.axisXInfo = father.config.axisX
  this.axisYInfo = father.config.axisY

  this.maxmin = father.maxmin
  this.axisX = father.layout.axisX

  this.context = father.father.cursorCanvas.context
  this.onClear = function () {
    _clearRect(this.context, this.rectFather.left, this.rectFather.top,
      this.rectFather.left + this.rectFather.width,
      this.rectFather.top + this.rectFather.height)
  }

  this.onPaint = function (mousePos, valueX, valueY) {
    if (typeof this.context._beforePaint === 'function') {
      this.context._beforePaint()
    }
    if (inRangeX(this.rectChart, mousePos.x) === false) return
    this.onClear()

    let txt
    let xx = mousePos.x
    let yy = mousePos.y
    const offX = this.axisPlatform === 'phone' ? 2 * this.scale : -2 * this.scale

    // 如果鼠标在本图区域，就画横线信息
    if (inRangeY(this.rectChart, mousePos.y)) {
      if (valueY === undefined) {
        valueY = this.maxmin.max - (mousePos.y - this.rectChart.top) / this.maxmin.unitY
      } else {
        yy = (this.maxmin.max - valueY) * this.maxmin.unitY + this.rectChart.top
      }

      _drawLineAlone(this.context, this.rectMain.left, yy, this.rectMain.left + this.rectMain.width, yy, this.color.grid)
      let posX = this.axisPlatform === 'phone' ? 'start' : 'end'

      if (this.axisYInfo.left.display !== 'none') {
        txt = formatInfo(
          valueY,
          this.axisYInfo.left.format,
          this.static.decimal,
          this.static.before)
        xx = this.rectMain.left + offX
        _drawTxtRect(this.context, xx, yy, txt, {
          font: this.axisX.font,
          pixel: this.axisX.pixel,
          spaceX: this.axisX.spaceX,
          clr: this.color.txt,
          bakclr: this.color.grid,
          x: posX,
          y: 'middle'
        })
      }
      if (this.axisYInfo.right.display !== 'none') {
        txt = formatInfo(
          valueY,
          this.axisYInfo.right.format,
          this.static.decimal,
          this.static.before)
        posX = this.axisPlatform === 'phone' ? 'end' : 'start'
        xx = this.rectMain.left + this.rectMain.width - offX
        _drawTxtRect(this.context, xx, yy, txt, {
          font: this.axisX.font,
          pixel: this.axisX.pixel,
          spaceX: this.axisX.spaceX,
          clr: this.color.txt,
          bakclr: this.color.grid,
          x: posX,
          y: 'middle'
        })
      }
    }

    _drawLineAlone(this.context, mousePos.x, this.rectMain.top, mousePos.x, this.rectMain.top + this.rectMain.height - 1, this.color.grid)
    if (this.axisXInfo.display !== 'none') {
      xx = mousePos.x
      const th = Math.floor((this.axisX.height - this.axisX.pixel - this.scale) / 2)
      yy = this.rectMain.top + this.rectMain.height + th
      txt = formatShowTime(this.father.data.key, valueX)
      const len = Math.round(_getTxtWidth(this.context, txt, this.axisX.font, this.axisX.pixel) / 2)
      let posX = 'center'
      if (xx - len < this.rectMain.left + offX) { xx = this.rectMain.left + offX; posX = 'start' }
      if (xx + len > this.rectMain.left + this.rectMain.width - offX) {
        xx = this.rectMain.left + this.rectMain.width - offX
        posX = 'end'
      }
      _drawTxtRect(this.context, xx, yy, txt, {
        font: this.axisX.font,
        pixel: this.axisX.pixel,
        spaceX: this.axisX.spaceX,
        clr: this.color.txt,
        bakclr: this.color.grid,
        x: posX,
        y: 'top'
      })
    }
    if (typeof this.context._afterPaint === 'function') {
      this.context._afterPaint()
    }
  }
}
