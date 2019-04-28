/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// 以下是 ClLineKBar 的实体定义

import {
  _drawBegin,
  _drawEnd,
  _drawmoveTo,
  _drawlineTo
} from '../util/cl.draw'
import getValue from '../data/cl.data.tools'
import {
  initCommonInfo,
  getLineColor
} from '../chart/cl.chart.init'
import {
  inRect
} from '../util/cl.tool'

/**
 * Class representing ClDrawLine
 * @export
 * @class ClDrawLine
 */
export default class ClDrawLine {
  /**

   * Creates an instance of ClDrawLine.
   * @param {Object} father
   * @param {Object} rectMain
   */
  constructor (father, rectMain) {
    initCommonInfo(this, father)
    this.rectMain = rectMain

    this.linkInfo = father.father.linkInfo
    this.source = father.father

    this.maxmin = father.maxmin
  }
  _getYaxis(value)
  {
      // this.rectMain.top + Math.round((this.maxmin.max - getValue(this.data, this.info.labelY, index)) * this.maxmin.unitY)
    let yy = 0
    if (value >= 0)
    {
      let hh = Math.round((this.maxmin.max - value) * this.maxmin.unitY)
      yy = this.rectMain.top + hh
      // hh = this.rectMain.height / 2 - hh
    }
    else if (value < 0)
    {
      // let hh = Math.round((value - this.maxmin.min) * this.maxmin.unitY)
      let hh = Math.round(Math.abs(value) * this.maxmin.unitY)
      yy = this.rectMain.top + this.rectMain.height / 2 + hh
      // hh = this.rectMain.height / 2 - hh
    }
    return yy
  }
  /**
   * paint
   * @param {String} key
   * @memberof ClDrawLine
   */
  onPaint (key) {    
    if (key !== undefined) this.hotKey = key

    this.data = this.source.getData(this.hotKey)
    // console.log("lines:", this.hotKey, this.info.labelY, this.data)
    
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
      xx = this.rectMain.left + (idx + 0.5)* (this.linkInfo.unitX + this.linkInfo.spaceX)
      yy = this._getYaxis(getValue(this.data, this.info.labelY, index))
      // this.rectMain.top + Math.round((this.maxmin.max - getValue(this.data, this.info.labelY, index)) * this.maxmin.unitY)
      if (Math.floor(idx / this.info.skips) > count) {
        count = Math.floor(idx / this.info.skips)
        isBegin = false
      }
      if (!isBegin) {
        isBegin = inRect(this.rectMain, { x: xx, y: yy })
        if (isBegin) _drawmoveTo(this.context, xx, yy)
        continue
      }
      // console.log('yy:', yy, this.maxmin.max, getValue(this.data, this.info.labelY, index), index, this.data.value.length);
      
      _drawlineTo(this.context, xx, yy)
    }
    _drawEnd(this.context)
  }
}
