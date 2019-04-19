/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// 以下是ClData的实体定义
// 一般只用操作这个类就可以获取单个股票的所有数据
// 不支持多个股票的数据，对于列表来说，这里只保存ID列表，其他的数据由实际画图自行获取，

import {
  fromTradeTimeToIndex,
  fromIndexToTradeTime,
  checkZero,
  getSize,
  checkDayZero,
  checkMDay,
  updateStatic,
  updateStaticPrice,
  findDateInDay,
  findIndexInMin,
  matchDayToWeek,
  matchDayToMon,
  getMinuteCount,
  transExrightMin,
  transExrightDay
} from './cl.data.tools'
import {
  FIELD_INFO,
  FIELD_DAY,
  FIELD_MIN,
  FIELD_TICK,
  FIELD_MDAY,
  FIELD_NOW,
  FIELD_ILINE
} from '../cl.data.def'
import {
  getDate,
  isEmptyArray,
  copyArrayOfDeep
} from '../util/cl.tool'
import {
  ClFormula
} from '../formula/cl.formula'
// 只保存一只股票的信息，当前日期，开收市时间

/**
 * Class representing ClData
 * data layer
 * @export
 * @class ClData
 */
export default class ClData {
  /**
   * Creates an instance of ClData.

   */
  constructor () {
    // this.formula = new ClFormula();
    this.static = {
      stktype: 1,
      volunit: 100, // 乘以后为原始值 股票为100 指数为10000
      coinzoom: 1,

      coindot: 2,
      volzoom: 1, // 成交量单位 乘以后为真实值 一般不用转换
      before: 1000,
      stophigh: 1100,
      stoplow: 900
    }
  }

  // 只保存一只股票的信息，当前日期，开收市时间
  /**
   * init data
   * @param {Number} tradeDate
   * @param {Number} tradetime
   * @memberof ClData
   */
  initData (tradeDate, tradetime) {
    this.formula = new ClFormula()
    this.clearData()
    if (tradetime === undefined) {
      this.tradeTime = [{
        begin: 930,
        end: 1130
      },
      {
        begin: 1300,
        end: 1500
      }
      ]
    } else {
      this.tradeTime = tradetime
    }

    if (tradeDate === undefined) {
      this.tradeDate = getDate() // 得到当天的日期
    } else {
      this.tradeDate = tradeDate // 最近一个交易日期，并不一定等于今天的日期，比如节假日期间
    }
  }
  // 包含一个股票所有的数据,以便于以后做公式系统也使用这个数据定义
  /**
   * clear data
   * @memberof ClData
   */
  clearData () {
    this.InData = [] // 数据 json格式数据 {key:..,fields:.., value:[[],[]...]}
    this.OutData = [] // 专门用于获取数据时临时产生的数据
  }
  /**
   * clear data
   * @memberof ClData
   */
  checkBefore () {
    if (this.static.before <= 0)
    {   
      console.log(this.InData['NOW'],this.InData['DAY']);
         
      if (this.InData['DAY'] || this.InData['MDAY'] || this.InData['MIN'])
      {
        if (this.InData['DAY'] && this.InData['DAY'].value && this.InData['DAY'].value.length > 1)
        {
          this.static.before = this.InData['DAY'].value[this.InData['DAY'].value.length - 2][FIELD_DAY.close]
        } 
        if (this.InData['MIN'] && this.InData['MIN'].value && this.InData['MIN'].value.length > 0)
        {
          this.static.before = this.InData['MIN'].value[0][FIELD_DAY.open]
        }
        if (this.InData['MDAY'] && this.InData['MDAY'].value && this.InData['MDAY'].value.length > 0)
        {
          this.static.before = this.InData['MDAY'].value[0][FIELD_TICK.close]
        }
      }
    }
  }
  // 下面是设置数据的方法
  /**
   * set data
   * @param {String} key
   * @param {Object} fields
   * @param {Array} value
   * @memberof ClData
   */
  setData (key, fields, value) {
    if (value === undefined) value = []
    if (this.InData[key] === undefined) this.InData[key] = {}
    switch (key) {
      case 'MDAY':
        value = checkMDay(value, this.tradeDate, this.tradeTime)
        break;
      case 'NOW':
      case 'ENOW':
        updateStaticPrice(this.static, FIELD_NOW, value)
        this.flushNowData(key, value)
        break
      case 'MIN':
      case 'DAY':
        value = checkDayZero(value, this.tradeDate)
        break
      case 'INFO':
        // this.static = 
        updateStatic(this.static, FIELD_INFO, value)
        break
    }
    console.log('set', this.static)
    // // 设置了CODE或者INFO后，把一些常用的数取出来放到static中
    // 仅仅接收以上和 MIN5 RIGHT 等原始数据，周月年和其他周期分钟线，全部通过计算获取
    this.InData[key] = {
      key,
      fields
    }
    this.InData[key].value = copyArrayOfDeep(value)
    this.checkBefore()
    console.log('---set', key, this.InData[key], this.static.before)
  }
  /**
   * flush tick
   * @param {Array} nowdata
   * @param {Array} fields
   * @memberof ClData
   */
  flushTick (nowdata, fields) {
    // if (this.static.stktype == 0) return ;
    if (getSize(this.InData['TICK']) < 1) {
      if (nowdata[fields.vol] > 0) {
        this.InData['TICK'] = {
          key: 'TICK',
          fields: FIELD_TICK,
          value: [nowdata[fields.time], nowdata[fields.close], nowdata[fields.vol]]
        }
      }
    } else {
      if (this.InData['TICK'].value[this.InData['TICK'].value.length - 1][FIELD_TICK.vol] < nowdata[fields.vol] ||
        this.InData['TICK'].value[this.InData['TICK'].value.length - 1][FIELD_TICK.close] !== nowdata[fields.close]) {
        // 成交量变化才生成tick,或收盘价不一样
        this.InData['TICK'].value.push([nowdata[fields.time], nowdata[fields.close], nowdata[fields.vol]])
      }
    }
  }
  /**
   * flush min data
   * @param {Array} nowdata
   * @param {Array} fields
   * @memberof ClData
   */
  flushMin (nowdata, fields) {
    if (this.InData['MIN'] === undefined) {
      this.InData['MIN'] = {
        key: 'MIN',
        fields: FIELD_MIN,
        value: [
          fromTradeTimeToIndex(nowdata[fields.time], this.tradeTime),
          nowdata[fields.open],
          nowdata[fields.high],
          nowdata[fields.low],
          nowdata[fields.close],
          nowdata[fields.vol],
          nowdata[fields.money]
        ]
      }
    } else {
      const index = fromTradeTimeToIndex(nowdata[fields.time], this.tradeTime)
      const checked = findIndexInMin(this.InData['MIN'], index)
      if (checked.status === 'old') {
        if (this.InData['MIN'].value[checked.index][fields.high] < nowdata[fields.close]) {
          this.InData['MIN'].value[checked.index][fields.high] = nowdata[fields.close]
        }
        if (this.InData['MIN'].value[checked.index][fields.low] > nowdata[fields.close]) {
          this.InData['MIN'].value[checked.index][fields.low] = nowdata[fields.close]
        }
        this.InData['MIN'].value[checked.index][fields.close] = nowdata[fields.close]
        this.InData['MIN'].value[checked.index][fields.vol] = nowdata[fields.vol]
        this.InData['MIN'].value[checked.index][fields.money] = nowdata[fields.money]
      } else if (checked.status === 'new') {
        this.InData['MIN'].value.push([index, nowdata[fields.close], nowdata[fields.close],
          nowdata[fields.close], nowdata[fields.close], nowdata[fields.vol], nowdata[fields.money]
        ])
      }
    }
  }
  // 当有新的NOW进来时，需要对TICK和当日MIN线进行更新，
  /**
   * flush now data
   * @param {String} key
   * @param {Array} nowdata
   * @memberof ClData
   */
  flushNowData (key, nowdata) {
    if (nowdata.length < 1) return
    let fields = FIELD_NOW
    // if (key === 'ENOW') fields = FIELD_ENOW
    if (checkZero(nowdata, fields)) return

    // 先处理TICK
    this.flushTick(nowdata, fields)

    // 再处理Min
    this.flushMin(nowdata, fields)
  }

  // 下面是获取数据的方法,先从OutData获取，没有数据就从InData数据中获取

  /**
   * get data
   * @param {String} key
   * @param {String} rightMode
   * @return {Array}
   * @memberof ClData
   */
  getData (key, rightMode) {
    switch (key) {
      case 'DAY':
        this.OutData['DAY'] = {
          key,
          fields: FIELD_DAY
        }
        this.OutData['DAY'].value = this.mergeDay(this.InData['DAY'], this.InData['NOW'], rightMode)
        // 对原始数据不做变更
        break
      case 'WEEK':
        this.OutData['WEEK'] = {
          key,
          fields: FIELD_DAY
        }
        this.OutData['WEEK'].value = this.mergeWeek(this.InData['DAY'], this.InData['NOW'], rightMode)
        // 每次都从日线计算生成 -- 避免除权数据无法正确显示的错误
        break
      case 'MON':
        this.OutData['MON'] = {
          key,
          fields: FIELD_DAY
        }
        this.OutData['MON'].value = this.mergeMon(this.InData['DAY'], this.InData['NOW'], rightMode)
        // 每次都从日线计算生成 -- 避免除权数据无法正确显示的错误
        break
      case 'MDAY':
        this.OutData['MDAY'] = {
          key,
          fields: FIELD_MDAY
        }
        this.OutData['MDAY'].value = this.mergeMDay(this.InData['MDAY'], this.InData['MIN'])
        // 每次都从日线计算生成
        break
      case 'M5':
      case 'M15':
      case 'M30':
      case 'M60':
        this.OutData[key] = {
          key,
          fields: FIELD_DAY
        }
        this.OutData[key].value = this.makeMinute(key, this.InData[key], rightMode)
        break
      case 'MIN':
        this.OutData[key] = {
          key,
          fields: FIELD_MIN
        }
        this.OutData[key].value = this.updateMinute(this.InData[key])
        break
    }
    // 先找Out中的数据，没有就找In的数据
    return this.OutData[key] ? this.OutData[key] : this.InData[key]
  }
  /**
   * update minute
   * @param {Object} source
   * @return {Array}
   * @memberof ClData
   */
  updateMinute (source) {
    let out = copyArrayOfDeep(source.value)

    let allmoney
    for (let k = 0; k < out.length; k++) {
      if (this.static.stktype === 0) {
        if (k === 0) {
          allmoney = out[k][FIELD_MIN.vol] * out[k][FIELD_MIN.close]
        } else {
          allmoney += (out[k][FIELD_MIN.vol] - out[k - 1][FIELD_MIN.vol]) * out[k][FIELD_MIN.close]
        }
        out[k][FIELD_MIN.allmoney] = allmoney
      } else {
        // value[k][fields.allmoney] = value[k][fields.money];
      }
    }
    return out
  }
  /**
   * merge day
   * @param {Object} source
   * @param {Array} now
   * @param {String} rightMode
   * @return {Array}
   * @memberof ClData
   */
  mergeDay (source, now, rightMode) {
    let out = copyArrayOfDeep(source.value)
    if (now !== undefined && !checkZero(now.value, now.fields)) {
      const checked = findDateInDay(source, getDate(now.value[now.fields.time]))
      if (checked.finded) {
        out[checked.index] = [
          getDate(now.value[now.fields.time]),
          now.value[now.fields.open],
          now.value[now.fields.high],
          now.value[now.fields.low],
          now.value[now.fields.close],
          now.value[now.fields.vol],
          now.value[now.fields.money]
        ]
      } else {
        out.push([
          getDate(now.value[now.fields.time]),
          now.value[now.fields.open],
          now.value[now.fields.high],
          now.value[now.fields.low],
          now.value[now.fields.close],
          now.value[now.fields.vol],
          now.value[now.fields.money]
        ])
      }
    }
    if (this.InData['RIGHT'] && rightMode !== 'none') {
      out = transExrightDay(out, this.InData['RIGHT'].value, rightMode,
        0, out.length - 1)
    }
    // this.config.start,this.config.stop);

    return out
  }
  /**
   * merge week data
   * @param {Object} source
   * @param {Array} now
   * @param {String} rightmode
   * @return {Array}
   * @memberof ClData
   */
  mergeWeek (source, now, rightmode) {
    const out = this.mergeDay(source, now, rightmode)
    return matchDayToWeek(out)
    // 合并周线
  }
  /**
   * merge month data
   * @param {Object} source
   * @param {Array} now
   * @param {String} rightmode
   * @return {Array}
   * @memberof ClData
   */
  mergeMon (source, now, rightmode) {
    const out = this.mergeDay(source, now, rightmode)
    return matchDayToMon(out)
    // 合并月线
  }
  /**
   * merge 5 day data
   * @param {Object} source
   * @param {Array} min
   * @return {Array}
   * @memberof ClData
   */
  mergeMDay (source, min) {
    let out = []

    if (source !== undefined && !isEmptyArray(source.value)) {
      out = copyArrayOfDeep(source.value)
      const lastDate = getDate(source.value[source.value.length - 1][source.fields.time])
      if (lastDate === this.tradeDate) {
        return out
      }
    }
    if (min === undefined || isEmptyArray(min.value)) {
      return out
    }
    const daymins = getMinuteCount(this.tradeTime) * 4
    let money
    for (let k = 0; k < min.value.length; k++) {
      if (this.static.stktype === 0) {
        if (k === 0) {
          money = min.value[k][min.fields.vol] * min.value[k][min.fields.close]
        } else {
          money += (min.value[k][min.fields.vol] - min.value[k - 1][min.fields.vol]) * min.value[k][min.fields.close]
        }
      } else {
        money = min.value[k][min.fields.money]
      }
      out.push([
        fromIndexToTradeTime(min.value[k][min.fields.idx], this.tradeTime, this.tradeDate),
        min.value[k][min.fields.close],
        k === 0 ? min.value[k][min.fields.vol] : min.value[k][min.fields.vol] - min.value[k - 1][min.fields.vol],
        daymins + min.value[k][min.fields.idx],
        min.value[k][min.fields.vol],
        money
      ])
    }
    return out
  }
  // source历史分钟线 nowmin当日分钟线
  /**
   * make minute data
   * @param {String} outkey
   * @param {Object} source
   * @param {Array} nowmin
   * @param {String} rightMode
   * @return {Array}
   * @memberof ClData
   */
  makeMinute (outkey, source, rightMode) {
    let out = []
    if (source !== undefined && !isEmptyArray(source.value)) {
      out = copyArrayOfDeep(source.value)
      if (this.InData['RIGHT'] !== undefined)
      {
        out = transExrightMin(out, this.InData['RIGHT'].value, rightMode,
            // this.config.start,this.config.stop);
            0, out.length - 1)
      }

      const lastDate = getDate(source.value[source.value.length - 1][source.fields.time])
      if (lastDate === this.tradeDate) {
        // 已经是最新的数据了
        return out
      }
    }
    // 没有原始数据或者未收市，需要把当日的nowmin合并
    // if (nowmin !== undefined && !isEmptyArray(nowmin.value)) {
    //   let offset = 5
    //   if (outkey === 'M15') offset = 15
    //   if (outkey === 'M30') offset = 30
    //   if (outkey === 'M60') offset = 60
    //   out = this.mergeNowMinToMin(out, nowmin, offset) // 当日的分钟线转成分钟线，索引转时间的问题
    // }
    // out = matchMinToMinute(out, outkey);
    return out
  }
  /**
   * merge now's min data to min data
   * @param {Object} source
   * @param {Array} min
   * @param {Number} offset
   * @return {Array}
   * @memberof ClData
   */
  mergeNowMinToMin (source, min, offset) {
    const curMin = []
    let sumVol = 0
    let sumMoney = 0

    let hasData = false
    let stopIdx = 4

    for (let k = 0; k < min.value.length; k++) {
      const curIndex = min.value[k][min.fields.idx]
      if (curIndex < 0) continue
      if (curIndex > stopIdx) {
        if (hasData) {
          curMin[min.fields.vol] = min.value[k][min.fields.vol] - sumVol
          curMin[min.fields.money] = min.value[k][min.fields.money] - sumMoney
          sumVol = min.value[k][min.fields.vol]
          sumMoney = min.value[k][min.fields.money]

          curMin[min.fields.time] = fromIndexToTradeTime(stopIdx, this.tradeTime, this.tradeDate)
          source.push(copyArrayOfDeep(curMin))
        }
        stopIdx = (Math.floor(curIndex / offset) + 1) * offset - 1
        curMin[min.fields.open] = min.value[k][min.fields.open]
        curMin[min.fields.high] = min.value[k][min.fields.high]
        curMin[min.fields.low] = min.value[k][min.fields.low]
        curMin[min.fields.close] = min.value[k][min.fields.close]
        hasData = true
      } else { // curIndex 在0-5之间
        if (hasData) {
          curMin[min.fields.high] = curMin[min.fields.high] > min.value[k][min.fields.high]
            ? curMin[min.fields.high] : min.value[k][min.fields.high]
          curMin[min.fields.low] = curMin[min.fields.low] < min.value[k][min.fields.low] ||
            min.value[k][min.fields.low] === 0
            ? curMin[min.fields.low] : min.value[k][min.fields.low]
          curMin[min.fields.close] = min.value[k][min.fields.close]
        } else {
          curMin[min.fields.open] = min.value[k][min.fields.open]
          curMin[min.fields.high] = min.value[k][min.fields.high]
          curMin[min.fields.low] = min.value[k][min.fields.low]
          curMin[min.fields.close] = min.value[k][min.fields.close]
          hasData = true
        }
      }
    } // for i
    if (hasData) {
      curMin[min.fields.vol] = min.value[min.value.length - 1][min.fields.vol] - sumVol
      curMin[min.fields.money] = min.value[min.value.length - 1][min.fields.money] - sumMoney
      curMin[min.fields.time] = fromIndexToTradeTime(stopIdx, this.tradeTime, this.tradeDate)
      source.push(copyArrayOfDeep(curMin))
    }
    return source
  }

  //  以下为公式系统，自由计算的定义

  /**
   * make lien data
   * @param {Object} source
   * @param {String} outkey
   * @param {String} formula
   * @return {Array}
   * @memberof ClData
   */
  makeLineData (source, outkey, formula) {
    const value = this.formula.runSingleStock(source, formula)
    if (this.OutData[outkey] === undefined) {
      this.OutData[outkey] = {
        outkey,
        fields: FIELD_ILINE,
        value
      }
    } else {
      this.OutData[outkey].value = value
      // 返回的值都是真实的值，不用再除单位了，具体显示几个小数点，由坐标的类别来定，
    }
    return this.OutData[outkey]
  }
} // end.
