'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineVBar 的实体定义
// //////////////////////////////////////////////////

import {
  _drawBegin,
  _drawEnd,
  _drawVBar
} from '../util/cl.draw'
import getValue from '../data/cl.data.tools'
import {
  initCommonInfo
} from '../chart/cl.chart.init'

// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawVBar (father, rectMain) {
  initCommonInfo(this, father)
  this.rectMain = rectMain

  this.linkInfo = father.father.linkInfo
  this.source = father.father

  this.maxmin = father.maxmin

  this.onPaint = function (key) {
    if (key !== undefined) this.hotKey = key
    this.data = this.source.getData(this.hotKey)

    _drawBegin(this.context, this.color.red)
    for (let k = 0, idx = this.linkInfo.minIndex; idx <= this.linkInfo.maxIndex; k++, idx++) {
      if (parseFloat(getValue(this.data, 'open', idx)) <= parseFloat(getValue(this.data, 'close', idx))) {
        _drawVBar(this.context, {
          filled: this.color.sys === 'white',
          index: k,
          spaceX: this.linkInfo.spaceX,
          unitX: this.linkInfo.unitX,
          unitY: this.maxmin.unitY,
          maxmin: this.maxmin,
          rect: this.rectMain,
          fillclr: this.color.red
        },
        getValue(this.data, 'vol', idx))
      }
    }
    _drawEnd(this.context)
    _drawBegin(this.context, this.color.green)
    for (let k = 0, idx = this.linkInfo.minIndex; idx <= this.linkInfo.maxIndex; k++, idx++) {
      if (parseFloat(getValue(this.data, 'open', idx)) > parseFloat(getValue(this.data, 'close', idx))) {
        _drawVBar(this.context, {
          filled: true,
          index: k,
          spaceX: this.linkInfo.spaceX,
          unitX: this.linkInfo.unitX,
          unitY: this.maxmin.unitY,
          maxmin: this.maxmin,
          rect: this.rectMain,
          fillclr: this.color.green
        },
        getValue(this.data, 'vol', idx))
      }
    }
    _drawEnd(this.context)
  }
}
