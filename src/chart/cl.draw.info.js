'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineKBar 的实体定义
// //////////////////////////////////////////////////

import {
  _fillRect,
  _getTxtWidth,
  _drawTxt
} from '../util/cl.draw'
import {
  initCommonInfo
} from '../chart/cl.chart.init'

// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawInfo (father, rectMain, rectMess) {
  initCommonInfo(this, father)
  this.rectMain = rectMain
  this.rectMess = rectMess

  this.linkInfo = father.father.linkInfo

  this.title = father.layout.title
  this.titleInfo = father.config.title

  this.onPaint = function (message) {
    if (this.titleInfo.display === 'none' || this.linkInfo.hideInfo) return

    _fillRect(this.context, this.rectMain.left + this.scale, this.rectMain.top + this.scale,
      this.rectMess.left + this.rectMess.width - 2 * this.scale,
      this.rectMain.height - 2 * this.scale, this.color.back)

    let clr = this.color.txt
    const spaceY = Math.round((this.title.height - this.title.pixel) / 2) - this.scale
    const yy = this.rectMess.top + spaceY

    if (this.titleInfo.label !== undefined) {
      _drawTxt(this.context, this.rectMain.left + this.scale, yy, this.titleInfo.label,
        this.title.font, this.title.pixel, clr)
    }
    let xx = this.rectMess.left + this.scale
    for (let i = 0; i < message.length; i++) {
      clr = this.color.line[i]
      if (message[i].txt !== undefined) {
        _drawTxt(this.context, xx, yy, message[i].txt, this.title.font, this.title.pixel, clr)
        xx += _getTxtWidth(this.context, message[i].txt, this.title.font, this.title.pixel) + this.title.spaceX
      }
      if (message[i].value === undefined) continue
      _drawTxt(this.context, xx, yy, ' ' + message[i].value, this.title.font, this.title.pixel, clr)
      xx += _getTxtWidth(this.context, ' ' + message[i].value, this.title.font, this.title.pixel) + this.title.spaceX
    }
  }
}
