/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// 预先定义好的公式，比如MA等，可在这里扩展公式定义
// 用户可以自定义公式注册到ClData层，便于系统调用

import getValue from '../data/cl.data.tools'

/**
 * Class representing ClFormula
 * @export
 * @class ClFormula
 */
export class ClFormula {
  /**
   * Creates an instance of ClFormula.
   * @constructor
   */
  constructor () {
    this.source = {
      data: {},
      minIndex: 0,
      maxIndex: 0,
      nowIndex: 0
    }
  }
  /**
   * get value from data layer
   * @param {String} label
   * @param {Number} offIndex
   * @return {Array}
   * @memberof ClFormula
   */
  getValue (label, offIndex) { // offIndex 向前偏移offIndex条记录
    if (label === undefined) return 0
    if (this.source.data === undefined || this.source.data.value === undefined) return 0

    if (this.source.nowIndex === undefined) this.source.nowIndex = this.source.minIndex
    const index = this.source.nowIndex - offIndex

    return getValue(this.source.data, label, index)
  }
  /**
   * calculate single stock data by formula
   * @param {Object} source
   * @param {String} formula
   * @return {Array}
   * @memberof ClFormula
   */
  runSingleStock (source, formula) {
    // fix for Wechat mina do not support eval
    if (!eval) {
      const singleValue = []
      const matchData = formula.match(/\.(\w+)(\(.+)/)
      const funcName = matchData[1]
      if (typeof this[funcName] !== 'function') {
        return singleValue
      }
      let argStr = matchData[2] || ''
      argStr = argStr.replace(/\(|\)/g, '').split(',')
      this.source = source
      for (this.source.nowIndex = this.source.minIndex; this.source.nowIndex <= this.source.maxIndex; this.source.nowIndex++) {
        const out = this[funcName](...argStr)
        singleValue.push([this.getValue('idx', 0), out])
      }
      return singleValue
    }
    const singleValue = []
    this.source = source
    const command = `
    for (this.source.nowIndex = this.source.minIndex;this.source.nowIndex <= this.source.maxIndex;this.source.nowIndex++) {
          const ${formula}
          singleValue.push([this.getValue('idx', 0), out]);
    }`
    eval(command)
    return singleValue
  }

  //  自定义公式

  /**
   * calculate move averge data
   * @param {String} label
   * @param {Number} period
   * @return {Array}
   * @memberof ClFormula
   */
  MA (label, period) {
    let off = 0
    let value = 0
    for (let m = 0; m < period; m++) {
      const v = this.getValue(label, m)
      if (v !== 0) {
        off++
        value += v
      }
    }
    return off === 0 ? 0 : value / off
  }
  AVGPRC () {
    let value = 0
    value = this.getValue('allmoney', 0) / this.getValue('allvol', 0)
    return value
  }
}
