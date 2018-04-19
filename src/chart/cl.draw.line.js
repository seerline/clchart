'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineKBar 的实体定义
// //////////////////////////////////////////////////

import {
  _drawBegin,
  _drawEnd,
  _drawmoveTo,
  _drawlineTo
} from '../util/cl.draw'
import getValue from '../data/cl.data.tools'
import { initCommonInfo } from '../chart/cl.chart.init'
import {
  inRect
} from '../util/cl.tool'
import {
  getLineColor
} from './cl.chart.tools'

export default function ClDrawLine (father, rectMain) {
  initCommonInfo(this, father)
  this.rectMain = rectMain

  this.linkInfo = father.father.linkInfo
  this.source = father.father

  this.maxmin = father.maxmin

  this.onPaint = function (key) {
    if (key !== undefined) this.hotKey = key
    this.data = this.source.getData(this.hotKey)

    if (this.info.labelX === undefined) this.info.labelX = 'idx'
    if (this.info.labelY === undefined) this.info.labelY = 'value'
    // 分钟线为‘close’

    let xx, yy
    let isBegin = false
    let idx
    let count = 0
    let clr
    if (this.info.color === undefined) {
      clr = getLineColor(this.info.colorIndex)
    } else {
      clr = this.color[this.info.color]
    }

    _drawBegin(this.context, clr)
    for (let k = this.linkInfo.minIndex, index = 0; k <= this.linkInfo.maxIndex; k++, index++) {
      if (this.info.showSort === undefined) {
        idx = index
      } else {
        idx = getValue(this.data, this.info.showSort, index)
      }
      // if (getValue(this.data, this.info.labelX, index) < 0) continue;
      xx = this.rectMain.left + idx * (this.linkInfo.unitX + this.linkInfo.spaceX)
      yy = this.rectMain.top + Math.round((this.maxmin.max - getValue(this.data, this.info.labelY, index)) * this.maxmin.unitY)
      if (Math.floor(idx / this.info.skips) > count) {
        count = Math.floor(idx / this.info.skips)
        isBegin = false
      }
      if (!isBegin) {
        isBegin = inRect(this.rectMain, { x: xx, y: yy })
        if (isBegin) _drawmoveTo(this.context, xx, yy)
        continue
      }
      _drawlineTo(this.context, xx, yy)
    }
    _drawEnd(this.context)
  }
}
