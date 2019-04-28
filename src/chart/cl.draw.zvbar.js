/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// 以下是 ClLineVBar 的实体定义

import {
  _drawBegin,
  _drawEnd,
  _drawZVBar
} from '../util/cl.draw'
import getValue from '../data/cl.data.tools'
import {
  initCommonInfo
} from '../chart/cl.chart.init'

// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
/**
 * Class representing ClDrawZVBar
 * @export
 * @class ClDrawZVBar
 */
export default class ClDrawZVBar {
  /**

   * Creates an instance of ClDrawZVBar.
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
  /**
   * paint
   * @param {String} key
   * @memberof ClDrawZVBar
   */
  onPaint (key) {
    if (key !== undefined) this.hotKey = key
    this.data = this.source.getData(this.hotKey)
    // console.log('ClDrawZVBar:', this.maxmin, this.linkInfo, this.rectMain);
    
    _drawBegin(this.context, this.color.red)
    for (let k = 0, idx = this.linkInfo.minIndex; idx <= this.linkInfo.maxIndex; k++, idx++) {
      let value = getValue(this.data, this.info.labelY, idx)
      if (value > 0 ) {
        _drawZVBar(this.context, {
          index: k,
          spaceX: this.linkInfo.spaceX,
          unitX: this.linkInfo.unitX,
          unitY: this.maxmin.unitY,
          maxmin: this.maxmin,
          rect: this.rectMain,
          fillclr: this.color.red
        },
        value)
      }
    }
    _drawEnd(this.context)
    _drawBegin(this.context, this.color.green)
    for (let k = 0, idx = this.linkInfo.minIndex; idx <= this.linkInfo.maxIndex; k++, idx++) {
      let value = getValue(this.data, this.info.labelY, idx)
      if (value < 0 ) {
        _drawZVBar(this.context, {
          index: k,
          spaceX: this.linkInfo.spaceX,
          unitX: this.linkInfo.unitX,
          unitY: this.maxmin.unitY,
          maxmin: this.maxmin,
          rect: this.rectMain,
          fillclr: this.color.green
        },
        value)
      }
    }
    _drawEnd(this.context)
  }
}
