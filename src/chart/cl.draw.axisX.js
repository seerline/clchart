'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineAxisX 的实体定义
// //////////////////////////////////////////////////

import {
  // _drawLineAlone,
  _drawTxt
} from '../util/cl.draw'
import getValue from '../data/cl.data.tools'
import {
  getDate,
  formatShowTime
} from '../util/cl.tool'
import {
  initCommonInfo
} from '../chart/cl.chart.init'

// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawAxisX (father, rectMain) {
  initCommonInfo(this, father)
  this.rectMain = rectMain

  this.linkInfo = father.father.linkInfo
  this.axisX = father.config.axisX

  this.maxmin = father.maxmin
  this.text = father.layout.axisX

  this.onPaint = function () {
    this.data = father.data
    if (this.axisX.display === 'none') return

    let xx, value, spaceX
    xx = this.rectMain.left + this.text.spaceX

    const yy = this.rectMain.top + this.rectMain.height / 2
    if (this.axisX.display === 'block') {
      let count = -1
      let days = 0
      const daymins = this.linkInfo.maxCount / (this.axisX.lines + 1)
      spaceX = this.rectMain.width / (this.axisX.lines + 1)
      for (let k = this.linkInfo.minIndex; k <= this.linkInfo.maxIndex; k++) {
        const index = getValue(this.data, 'idx', k)
        if (index < 0) continue
        days = Math.floor(index / daymins)
        if (days > count) {
          count = days
          xx = this.rectMain.left + spaceX / 2 + spaceX * count
          value = getDate(getValue(this.data, 'time', k))
          _drawTxt(this.context, xx, yy, value,
            this.text.font, this.text.pixel, this.color.axis, { y: 'middle', x: 'center' })
        }
      }
    } else {
      if (this.axisX.format === 'tradetime') {
        this.tradeTime = this.father.father.dataLayer.tradeTime
        value = formatShowTime(this.data.key, 0, this.tradeTime[0].begin)
        _drawTxt(this.context, xx, yy, value,
          this.text.font, this.text.pixel, this.color.axis, {
            y: 'middle'
          })

        xx = this.rectMain.left + this.rectMain.width - 3
        value = formatShowTime(this.data.key, 0, this.tradeTime[this.tradeTime.length - 1].end)
        _drawTxt(this.context, xx, yy, value,
          this.text.font, this.text.pixel, this.color.axis, {
            y: 'middle',
            x: 'end'
          })
      } else {
        // _drawLineAlone(this.context, this.rectMain.left, this.rectMain.top,
        //   this.rectMain.left + this.rectMain.width, this.rectMain.top, this.color.red)
        value = getValue(this.data, 'time', this.linkInfo.minIndex)
        value = formatShowTime(this.data.key, value, this.maxmin.min)
        _drawTxt(this.context, xx, yy, value,
          this.text.font, this.text.pixel, this.color.axis, {
            y: 'middle'
          })

        xx = this.rectMain.left + this.rectMain.width - 3
        value = getValue(this.data, 'time', this.linkInfo.maxIndex)
        value = formatShowTime(this.data.key, value, this.maxmin.max)
        _drawTxt(this.context, xx, yy, value,
          this.text.font, this.text.pixel, this.color.axis, {
            y: 'middle',
            x: 'end'
          })
      }
    }
  }
}
