'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineKBar 的实体定义
// //////////////////////////////////////////////////

import {
  _drawBegin,
  _drawEnd,
  _drawLineAlone,
  _drawmoveTo,
  _drawlineTo
} from '../util/cl.draw'
import getValue from '../data/cl.data.tools'
import {
  initCommonInfo,
  getLineColor
} from '../chart/cl.chart.init'

export default function ClDrawVLine (father, rectMain) {
  initCommonInfo(this, father)
  this.rectMain = rectMain
  // this.rectMain = {
  //   left:rectMain.left,
  //   top:rectMain.top,
  //   width:rectMain.width,
  //   height:rectMain.height
  // };
  this.linkInfo = father.father.linkInfo
  this.source = father.father

  this.maxmin = father.maxmin

  this.onPaint = function (key) {
    if (key !== undefined) this.hotKey = key
    this.data = this.source.getData(this.hotKey)

    if (this.info.labelX === undefined) this.info.labelX = 'time'
    if (this.info.labelY === undefined) this.info.labelY = 'vol'

    let xx, yy, value
    let idx
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
      xx = this.rectMain.left + Math.floor(idx * (this.linkInfo.spaceX + this.linkInfo.unitX))
      value = getValue(this.data, this.info.labelY, k)
      if (value < 0) continue
      yy = this.rectMain.top + Math.round((this.maxmin.max - value) * this.maxmin.unitY)
      if (yy < this.rectMain.top) {
        yy = this.rectMain.top + 1
        _drawLineAlone(this.context, xx, this.rectMain.top + this.rectMain.height - 1, xx, yy, this.color.white)
        continue
      }
      _drawmoveTo(this.context, xx, this.rectMain.top + this.rectMain.height - 1)
      _drawlineTo(this.context, xx, yy)
    }
    _drawEnd(this.context)
  }
}
