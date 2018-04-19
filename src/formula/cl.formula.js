'use strict'

// /////////////////////////////////////////
// 预先定义好的公式，比如MA等，可在这里扩展公式定义
// 用户可以自定义公式注册到ClData层，便于系统调用
// ////////////////////////////////////////
import getValue from '../data/cl.data.tools'

export function ClFormula () {
  this.source = {
    data: {},
    minIndex: 0,
    maxIndex: 0,
    nowIndex: 0
  }
  this.getValue = function (label, offIndex) { // offIndex 向前偏移offIndex条记录
    if (label === undefined) return 0
    if (this.source.data === undefined || this.source.data.value === undefined) return 0

    if (this.source.nowIndex === undefined) this.source.nowIndex = this.source.minIndex
    const index = this.source.nowIndex - offIndex

    return getValue(this.source.data, label, index)
  }
  this.runSingleStock = function (source, formula) {
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
  // ///////////////////
  //  自定义公式
  // /////////////////
  this.MA = function (label, period) {
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
  this.AVGPRC = function () {
    let value = 0
    value = this.getValue('allmoney', 0) / this.getValue('allvol', 0)
    return value
  }
}

//
// 求均价时，需要考虑指数的均价问题
// case 'MIN':
// // 处理指数的均线问题
// allmoney = 0;
// fields = getFields('MIN');
// if (this.InData.MIN === undefined) break;
// value = this.InData['MIN'].value;
// for (let k = 0; k < value.length; k++) {
//   if (this.static.stktype === 0) {
//     if (k === 0) {
//       allmoney = value[k][fields.vol] * value[k][fields.close] / this.static.coinunit;
//     } else {
//       allmoney += (value[k][fields.vol] - value[k - 1][fields.vol]) * value[k][fields.close] / this.static.coinunit;
//     }
//     value[k][fields.allmoney] = allmoney;
//   } else {
//     // value[k][fields.allmoney] = value[k][fields.money];
//   }
// }
// break;
