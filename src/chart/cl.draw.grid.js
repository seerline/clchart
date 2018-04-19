'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineKBar 的实体定义
// //////////////////////////////////////////////////

import {
  _drawBegin,
  _drawEnd,
  _drawHline,
  _drawVline
} from '../util/cl.draw'
import {
  initCommonInfo
} from '../chart/cl.chart.init'

// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawGrid (father, rectMain) {
  initCommonInfo(this, father)
  this.rectMain = rectMain

  this.axisX = father.config.axisX
  this.axisY = father.config.axisY

  this.onPaint = function () {
    _drawBegin(this.context, this.color.grid)
    _drawHline(this.context, this.rectMain.left, this.rectMain.left + this.rectMain.width, this.rectMain.top)
    if (this.axisY.lines > 0) {
      const offy = this.rectMain.height / (this.axisY.lines + 1)
      for (let i = 0; i < this.axisY.lines; i++) {
        _drawHline(this.context, this.rectMain.left, this.rectMain.left + this.rectMain.width, this.rectMain.top + Math.round((i + 1) * offy))
      }
    }
    if (this.axisX.display !== 'none') {
      _drawHline(this.context, this.rectMain.left, this.rectMain.left + this.rectMain.width, this.rectMain.top + this.rectMain.height)
    }
    // 画纵坐标
    if (this.axisX.lines > 0) {
      const offx = this.rectMain.width / (this.axisX.lines + 1)
      for (let i = 0; i < this.axisX.lines; i++) {
        _drawVline(this.context, this.rectMain.left + Math.round((i + 1) * offx), this.rectMain.top, this.rectMain.top + this.rectMain.height)
      }
    }
    if (this.axisPlatform !== 'phone') {
      _drawVline(this.context, this.rectMain.left, this.rectMain.top, this.rectMain.top + this.rectMain.height)
      _drawVline(this.context, this.rectMain.left + this.rectMain.width, this.rectMain.top, this.rectMain.top + this.rectMain.height)
    }
    _drawEnd(this.context)
  }
}
