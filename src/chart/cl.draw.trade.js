'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineRight 的实体定义
// //////////////////////////////////////////////////

import {
  _getTxtWidth,
  _drawTxt
} from '../util/cl.draw'
import {
  findNearTimeToIndex
} from './cl.chart.tools'
import getValue from '../data/cl.data.tools'
import {
  initCommonInfo
} from '../chart/cl.chart.init'

// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawTrade (father, rectMain) {
  initCommonInfo(this, father)
  this.rectMain = rectMain

  this.linkInfo = father.father.linkInfo
  this.source = father.father
  this.symbol = father.layout.symbol

  this.maxmin = father.maxmin

  this.onPaint = function (key) {
    if (key !== undefined) this.hotKey = key
    this.data = this.source.getData(this.hotKey)

    const len = _getTxtWidth(this.context, '▲', this.symbol.font, this.symbol.pixel)
    for (let i = 0; i < this.data.value.length; i++) {
      const idx = findNearTimeToIndex(this.data, getValue(this.data, 'time', i))
      const offset = idx - this.linkInfo.minIndex
      const xx = this.rectMain.left + offset * (this.linkInfo.unitX + this.linkInfo.spaceX) + Math.floor(this.linkInfo.unitX / 2)
      if (xx < this.rectMain.left) {
        continue
      }
      let yy = this.rectChart.top
      const type = getValue(this.data, 'type', i)
      switch (type) {
        case 1:
        case 'B':
          yy += Math.round((this.maxmin.max - getValue(this.data, 'low', idx)) * this.maxmin.unitY)
          _drawTxt(this.context, xx - Math.floor(len / 2), yy, '▲', this.symbol.font,
            this.symbol.pixel, this.color.red, { y: 'top' })
          break
        case 2:
        case 'S':
          yy += Math.floor((this.maxmin.max - getValue(this.data, 'high', idx)) * this.maxmin.unitY)
          _drawTxt(this.context, xx - Math.floor(len / 2), yy, '▼', this.symbol.font,
            this.symbol.pixel, this.color.green, { y: 'bottom' })
          break
        default:
          _drawTxt(this.context, xx - Math.floor(len / 2), yy, '★', this.symbol.font,
            this.symbol.pixel, this.color.vol, { y: 'top' })
          break
      }
    }
  }
}
