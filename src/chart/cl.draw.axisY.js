'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineAxisY 的实体定义
// //////////////////////////////////////////////////

import {
  _drawTxt
} from '../util/cl.draw'
import {
  initCommonInfo
} from '../chart/cl.chart.init'
import {
  formatInfo
} from '../util/cl.tool'

// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawAxisY (father, rectMain, align) {
  initCommonInfo(this, father)
  this.rectMain = rectMain
  this.linkInfo = father.father.linkInfo

  this.static = father.static

  this.align = align
  this.axisY = father.config.axisY

  this.maxmin = father.maxmin
  this.text = father.layout.title

  this.onPaint = function () {
    if (this.axisY[this.align].display === 'none') return
    if (this.linkInfo.hideInfo) return

    let xx, yy
    let value, clr

    let posX
    const offX = this.axisPlatform === 'phone' ? 2 * this.scale : -2 * this.scale

    if (this.align === 'left') {
      if (this.axisPlatform === 'phone') {
        posX = 'start'
        xx = this.rectMain.left + offX
      } else {
        posX = 'end'
        xx = this.rectMain.left + this.rectMain.width + offX
      }
    } else {
      if (this.axisPlatform === 'phone') {
        posX = 'end'
        xx = this.rectMain.left + this.rectMain.width - offX
      } else {
        posX = 'start'
        xx = this.rectMain.left - offX
      }
    }
    yy = this.rectMain.top + this.scale // 画最上面的

    // console.log(xx, yy)
    // 画不画最上面的坐标
    if (this.axisY[this.align].display !== 'noupper') {
      yy = this.rectMain.top + this.scale // 画最上面的
      clr = this.axisY[this.align].middle !== 'before' ? this.color.axis : this.color.red
      value = formatInfo(
        this.maxmin.max,
        this.axisY[this.align].format,
        this.static.decimal,
        this.static.before)
      _drawTxt(this.context, xx, yy, value,
        this.text.font, this.text.pixel, clr,
        { x: posX, y: 'top' })
    }
    // 画不画最下面的坐标
    if (this.axisY[this.align].display !== 'nofoot') {
      clr = this.axisY[this.align].middle !== 'before' ? this.color.axis : this.color.green
      yy = this.rectMain.top + this.rectMain.height - this.scale
      value = formatInfo(
        this.maxmin.min,
        this.axisY[this.align].format,
        this.static.decimal,
        this.static.before)
      _drawTxt(this.context, xx, yy, value,
        this.text.font, this.text.pixel, clr,
        { x: posX, y: 'bottom' })
    }
    // 画其他的坐标线
    const offy = this.rectMain.height / (this.axisY.lines + 1)

    for (let i = 0; i < this.axisY.lines; i++) {
      value = this.maxmin.max - offy * (i + 1) / this.maxmin.unitY
      yy = this.rectMain.top + Math.round((i + 1) * offy)
      clr = this.color.axis
      if (this.axisY[this.align].middle !== 'none') {
        if ((i + 1) < Math.round(this.axisY.lines / 2)) clr = this.color.red
        if ((i + 1) > Math.round(this.axisY.lines / 2)) clr = this.color.green
        if ((i + 1) === Math.round(this.axisY.lines / 2)) {
          value = this.axisY[this.align].middle === 'zero' ? 0 : this.static.before
        }
      }

      value = formatInfo(
        value,
        this.axisY[this.align].format,
        this.static.decimal,
        this.static.before)

      _drawTxt(this.context, xx, yy, value,
        this.text.font, this.text.pixel, clr,
        { x: posX, y: 'middle' })
    }
  }
}
