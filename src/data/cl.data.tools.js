'use strict'

import {
  FIELD_DAY,
  FIELD_TICK,
  FIELD_RIGHT,
  FIELD_DAY5
} from '../cl.data.def'

import {
  copyArrayOfDeep,
  isEmptyArray,
  getDate,
  getDayWeek,
  getDayGap,
  getDayMon,
  getMinuteGap,
  getMinute,
  getMinuteOffset
} from '../util/cl.tool'

// 按fields定义从数组value中获取，第index条标记为label的数据
export default function getValue ({
  fields,
  value,
  coinunit
}, label, index = 0) {
  let val = 0
  try {
    // 支持二维数组和一维数组，判断如果是二维数组就取对应的值
    let source = value
    if (Array.isArray(value[0])) {
      source = value[index]
    }
    switch (label) {
      case 'idx':
        // 序列，now 0-239，day5 0-5*239
        // 非常重要，利用这里可以统一MIN和D5的画图
        if (fields.idx === undefined) val = index
        else val = source[fields.idx]
        break
      case 'coinunit':
        val = Math.pow(10, getValue({
          fields,
          value
        }, 'decimal', 0))
        break
      case 'before':
      case 'open':
      case 'high':
      case 'low':
      case 'close':
      case 'stophigh':
      case 'stoplow':
      case 'buy1':
      case 'buy2':
      case 'buy3':
      case 'buy4':
      case 'buy5':
      case 'sell1':
      case 'sell2':
      case 'sell3':
      case 'sell4':
      case 'sell5':
        if (coinunit === undefined) coinunit = 100
        val = source[fields[label]] / coinunit
        break
      case 'flow':
      case 'total':
        val = source[fields[label]] * 100
        break
      case 'decvol':
        if (index === 0) {
          val = source[fields.vol]
        } else {
          val = source[fields.vol] - getValue({
            fields,
            value
          }, 'vol', index - 1)
        }
        break
      case 'decmoney':
        if (index === 0) {
          val = source[fields.money]
        } else {
          val = source[fields.money] - getValue({
            fields,
            value
          }, 'money', index - 1)
        }
        break
      default:
        if (source[fields[label]]) {
          val = source[fields[label]]
        }
    }
  } catch (error) {
    val = 0
  }
  return val
}

// export function getTimeIndex(data, label, value) {
//   let idx = -1;
//   for (let i = data.value.length - 1; i >= 0; i--) {
//     if (getValue(data, label, i) > value) continue;
//     idx = i;
//     break;
//   }
//   return idx;
// }

export function getValueMax (data, label, value) {
  let out = value
  if (!Array.isArray(data.value)) return out
  for (let k = 0; k < data.value.length; k++) {
    const v = getValue(data, label, k)
    if (v > out) out = v
  }
  return out
}
export function getValueMin (data, label, value) {
  let out = value
  if (!Array.isArray(data.value)) return out
  for (let k = 0; k < data.value.length; k++) {
    const v = getValue(data, label, k)
    if (v < out) out = v
  }
  return out
}

// /////////////////////////////////////////
// 日线除权的函数集合
// /////////////////////////////////////////

function _getExrightPara (rightdata) {
  let exrightGs = 1000 // 送股数
  let exrightPg = 0 // 配股数
  let exrightPx = 0 // 利息
  if (rightdata[FIELD_RIGHT.accrual]) exrightPx = rightdata[FIELD_RIGHT.accrual] / 10
  if (rightdata[FIELD_RIGHT.sendstock] > 0 || rightdata[FIELD_RIGHT.allotstock] > 0) {
    exrightGs = 1000 + rightdata[FIELD_RIGHT.sendstock] / 10 + rightdata[FIELD_RIGHT.allotstock] / 10
    exrightPg = -rightdata[FIELD_RIGHT.allotprice] * rightdata[FIELD_RIGHT.allotstock] / 10000
  }
  return {
    gs: exrightGs,
    pg: exrightPg,
    px: exrightPx
  }
}
// 传入的价格和传出的价格都是放大coinunit倍的整形
function _getExrightPrice (price, coinunit, rightpara, mode) {
  if (coinunit === undefined) coinunit = 100
  if (mode === 'forword') {
    price = (price * (1000 / coinunit) - rightpara.pg - rightpara.px) * 1000 / rightpara.gs
  } else {
    price = price * (1000 / coinunit) * rightpara.gs / 1000 + rightpara.pg + rightpara.px
  }
  // return Math.floor(price / (1000 / coinunit) + 0.5)
  return price / (1000 / coinunit)
}
// 得到某个价格的除权价
export function getExrightPriceRange (start, stop, price, coinunit, rights) {
  if (rights === undefined || rights.length < 1) return price
  let rightpara
  for (let j = 0; j < rights.length; j++) {
    if (rights[j][0] > start && rights[j][0] <= stop) {
      rightpara = _getExrightPara(rights[j])
      price = _getExrightPrice(price, coinunit, rightpara, 'forword')
      break
    }
  }
  return price
}

function _transExright (days, coinunit, rightdata, mode, start, end) {
  const rightpara = _getExrightPara(rightdata)
  if (mode === 'forword') {
    for (let i = start; i < end; i++) {
      days[i][FIELD_DAY.open] = _getExrightPrice(days[i][FIELD_DAY.open], coinunit, rightpara, mode) // open
      days[i][FIELD_DAY.high] = _getExrightPrice(days[i][FIELD_DAY.high], coinunit, rightpara, mode) // high
      days[i][FIELD_DAY.low] = _getExrightPrice(days[i][FIELD_DAY.low], coinunit, rightpara, mode) // low
      days[i][FIELD_DAY.close] = _getExrightPrice(days[i][FIELD_DAY.close], coinunit, rightpara, mode) // new
      days[i][FIELD_DAY.vol] = days[i][FIELD_DAY.vol] * rightpara.gs / 1000
    }
  }
}

// 判断是否有除权
function _isRight (dateBegin, dateEnd, rightdate) {
  if (rightdate > dateBegin && rightdate <= dateEnd) {
    return true
  } else return false
}
// 对日线进行除权，周年线不能除权，,days传入时就是一个可修改的数组
export function transExrightDay (days, coinunit, rights, mode, start, end) {
  if (rights.length < 1 || days.length < 1) return days
  if (mode === undefined) mode = 'forword' // 以最近的价格为基准,修正以前的价格;
  if (start === undefined || start < 0 || start > days.length - 1) start = 0
  if (end === undefined || end < 0) end = days.length - 1

  if (mode === 'forword') {
    for (let i = start; i <= end; i++) {
      for (let j = 0; j < rights.length; j++) {
        if (i < 1) continue
        if (_isRight(days[i - 1][FIELD_DAY.time], days[i][FIELD_DAY.time], rights[j][FIELD_RIGHT.time])) {
          _transExright(days, coinunit, rights[j], mode, start, i)
          break
        }
      }
    }
  } else if (mode === 'backword') {
  }
  return days
}

// 对分钟线除权,days传入时就是一个可修改的数组
export function transExrightMin (days, coinunit, rights, mode, start, end) {
  if (rights.length < 1 || days.length < 1) return days
  if (mode === undefined) mode = 'forword' // 以最近的价格为基准,修正以前的价格;
  if (start === undefined || start < 0 || start > days.length - 1) start = 0
  if (end === undefined || end < 0) end = days.length - 1

  if (mode === 'forword') {
    for (let i = start; i <= end; i++) {
      for (let j = 0; j < rights.length; j++) {
        if (i < 1) continue
        if (_isRight(
          getDate(days[i - 1][FIELD_DAY.time]),
          getDate(days[i][FIELD_DAY.time]),
          rights[j][FIELD_RIGHT.time])) {
          _transExright(days, coinunit, rights[j], mode, start, i)
          break
        }
      }
    }
  } else if (mode === 'backword') {
  }
  return days
}
// /////////////////
// 检索数据函数集
// /////////////////
// 从分钟线查找对应记录
export function findIndexInMin (source, index) {
  if (source.value.length < 1) {
    return {
      status: 'new',
      index: -1
    }
  }
  const lastIndex = source.value[source.value.length - 1][source.fields.time]
  if (lastIndex === index) {
    return {
      status: 'old',
      index: source.value.length - 1
    }
  } else if (lastIndex > index) {
    return {
      status: 'error',
      index: source.value.length - 1
    }
  } else {
    return {
      status: 'new',
      index: source.value.length - 1
    }
  }
}
// 从日线查找对应记录
export function findDateInDay (source, today) {
  if (source === undefined || source.value === undefined || source.value.length < 1) {
    return {
      finded: false,
      index: -1
    }
  }
  const lastDate = source.value[source.value.length - 1][source.fields.time]
  if (today === lastDate) {
    return {
      finded: true,
      index: source.value.length - 1
    }
  }
  return {
    finded: false,
    index: -1
  }
}
// export function findDateInDay(source, today) {
//   if (source === undefined || source.value === undefined || source.value.length < 1)
//   {
//     return {
//       finded: false,
//       index: -1
//     };
//   }
//   const fields = source.fields;
//   for (let i = source.value.length - 1; i >= 0; i--) {
//     if (source.key === 'WEEK') {
//       const curDay = source.value[i][fields.time];
//       if (getDayGap(curDay, today) + getDayWeek(curDay) > 7) {
//         return {
//           finded: false,
//           index: -1
//         };
//       } else {
//         return {
//           finded: true,
//           index: i
//         };
//       }
//     }
//     if (source.key === 'MON') {
//       const curMon = Math.floor(source.value[i][fields.time] / 100);
//       const todayMon = Math.floor(today / 100);
//       if (curMon !== todayMon) {
//         return {
//           finded: false,
//           index: -1
//         };
//       } else {
//         return {
//           finded: true,
//           index: i
//         };
//       }
//     }
//     if (source.key === 'DAY') {
//       if (source.value[i][fields.time] === today) {
//         return {
//           finded: true,
//           index: i
//         };
//       }
//     }
//   }
//   return {
//     finded: false,
//     index: source.value.length - 1
//   };
// }

// /////////////////
// 检查数据完整性
// /////////////////
export function getSize (source) {
  if (source === undefined || isEmptyArray(source.value)) {
    return 0
  }
  return source.value.length
}
export function checkZero (value, fields) {
  if (Array.isArray(value) &&
    value[fields.open] > 0 &&
    value[fields.high] > 0 &&
    value[fields.low] > 0 &&
    value[fields.close] > 0 &&
    value[fields.vol] > 0 &&
    value[fields.money] > 0) {
    return false
  } else {
    return true
  }
}
export function checkDayZero (source) {
  const out = []
  if (!Array.isArray(source)) return out

  for (let i = 0; i < source.length; i++) {
    if (!checkZero(source[i], FIELD_DAY)) {
      out.push(source[i])
    }
  }
  return out
}

export function checkDay5 (source, coinunit, tradeDate, tradetime) {
  const out = []
  if (source.length < 1) return out

  const lastDate = getDate(source[source.length - 1][FIELD_DAY5.time])
  // 判断是否已经有收盘数据了
  let maxDays = 5
  if (!lastDate === tradeDate) maxDays = 4

  let idx
  let count = 0
  let curDate = 0
  for (idx = source.length - 1; idx >= 0; idx--) {
    if (curDate !== getDate(source[idx][FIELD_DAY5.time])) {
      curDate = getDate(source[idx][FIELD_DAY5.time])
      count++
      if (count > maxDays) {
        idx++
        break
      }
    }
    out.splice(0, 0, [source[idx][FIELD_DAY5.time], source[idx][FIELD_DAY5.close], source[idx][FIELD_DAY5.vol]])
  }

  count = 0
  curDate = 0
  let vol = 0
  let money = 0
  const daymins = getMinuteCount(tradetime)
  for (idx = 0; idx < out.length; idx++) {
    if (curDate !== getDate(out[idx][FIELD_DAY5.time])) { // 增加记录
      curDate = getDate(out[idx][FIELD_DAY5.time])
      count++
      vol = 0
      money = 0
    }
    vol += out[idx][FIELD_DAY5.vol]
    money += out[idx][FIELD_DAY5.close] * out[idx][FIELD_DAY5.vol] / coinunit
    let index = fromTradeTimeToIndex(out[idx][FIELD_DAY5.time], tradetime)
    index += (count - 1) * daymins
    out[idx][FIELD_DAY5.idx] = index
    out[idx][FIELD_DAY5.allvol] = vol
    out[idx][FIELD_DAY5.allmoney] = money
  }
  return out
}

export function updateStatic (fields, value) {
  const coinunit = getValue({
    fields,
    value
  }, 'coinunit')
  const out = {
    stktype: getValue({
      fields,
      value
    }, 'type'),
    volunit: getValue({
      fields,
      value
    }, 'volunit'),
    coinunit,
    decimal: getValue({
      fields,
      value
    }, 'decimal'),
    before: getValue({
      fields,
      value,
      coinunit
    }, 'before'),
    stophigh: getValue({
      fields,
      value,
      coinunit
    }, 'stophigh'),
    stoplow: getValue({
      fields,
      value,
      coinunit
    }, 'stoplow')
  }
  return out
}

// /////////////////
// 对数据进行周期性合并
// /////////////////
// export function matchMinToMinute(source, outkey) {
//   switch (outkey) {
//     case 'M15': out = matchMin5ToMinute(out, outkey, 15);
//       break;
//     case 'M30': out = matchMin5ToMinute(out, outkey, 30);
//       break;
//     case 'M60': out = matchMin5ToMinute(out, outkey, 60);
//       break;
//   }
// export function mergeMin(daydata, rate) {
// this.match_minute_line = function(srcfields, srcvalue, minfields, minvalue, period) {
//   const out = copyArrayOfDeep(srcvalue);
//   const cur_min = [];
//   let base_vol = 0;
//   let base_money = 0;

//   let hasData = false;
//   let stopIdx = 4;
//   for (let k = 0; k < minvalue.length; k++) {
//     const nowmin = minvalue[k][minfields.idx];
//     if (nowmin < 0) continue;
//     if (nowmin > stopIdx) {
//       if (hasData) {
//         cur_min[minfields.vol] = minvalue[k][minfields.vol] - base_vol;
//         cur_min[minfields.money] = minvalue[k][minfields.money] - base_money;
//         base_vol = minvalue[k][minfields.vol];
//         base_money = minvalue[k][minfields.money];

//         cur_min[minfields.time] = fromIndexToTradeTime(stopIdx, this.tradetime, this.tradeDate);
//         out.push(copyArrayOfDeep(cur_min));
//       }
//       stopIdx = (Math.floor(nowmin / offset) + 1) * offset - 1;
//       cur_min[minfields.open] = minvalue[k][minfields.open];
//       cur_min[minfields.high] = minvalue[k][minfields.high];
//       cur_min[minfields.low] = minvalue[k][minfields.low];
//       cur_min[minfields.close] = minvalue[k][minfields.close];
//       hasData = true;
//     } else { // nowmin 在0-5之间
//       if (hasData) {
//         cur_min[minfields.high] = cur_min[minfields.high] > minvalue[k][minfields.high] ? cur_min[minfields.high] : minvalue[k][minfields.high];
//         cur_min[minfields.low] = cur_min[minfields.low] < minvalue[k][minfields.low] || minvalue[k][minfields.low] === 0 ?
//                                   cur_min[minfields.low] : minvalue[k][minfields.low];
//         cur_min[minfields.close] = minvalue[k][minfields.close];
//       } else {
//         cur_min[minfields.open] = minvalue[k][minfields.open];
//         cur_min[minfields.high] = minvalue[k][minfields.high];
//         cur_min[minfields.low] = minvalue[k][minfields.low];
//         cur_min[minfields.close] = minvalue[k][minfields.close];
//         hasData = true;
//       }
//     }
//   } // for i
//   if (hasData) {
//     cur_min[minfields.vol] = minvalue[minvalue.length - 1][minfields.vol] - base_vol;
//     cur_min[minfields.money] = minvalue[minvalue.length - 1][minfields.money] - base_money;
//     cur_min[minfields.time] = fromIndexToTradeTime(stopIdx, this.tradetime, this.tradeDate);
//     out.push(copyArrayOfDeep(cur_min));
//     // alert('4:'+out.toString());
//   }
//   return out;
// }

// 按rate率压缩日线和分钟数据，因为界面显示原因，可能会存在2日...7日等合并的线
export function getZipDay (daydata, rate) {
  if (rate < 1) return daydata
  const out = []
  const zipday = []

  let count = 0
  const field = FIELD_DAY
  for (let k = 0; k < daydata.length; k++) {
    if (count === 0) {
      zipday[field.open] = daydata[k][field.open]
      zipday[field.high] = daydata[k][field.high]
      zipday[field.low] = daydata[k][field.low]
      zipday[field.close] = daydata[k][field.close]
      zipday[field.vol] = daydata[k][field.vol]
      zipday[field.money] = daydata[k][field.money]
      count = 1
    } else {
      zipday[field.high] = zipday[field.high] > daydata[k][field.high]
        ? zipday[field.high] : daydata[k][field.high]
      zipday[field.low] = zipday[field.low] < daydata[k][field.low] || daydata[k][field.low] === 0
        ? zipday[field.low] : daydata[k][field.low]
      zipday[field.close] = daydata[k][field.close]
      zipday[field.vol] += daydata[k][field.vol]
      zipday[field.money] += daydata[k][field.money]
      count++
      if (count >= rate) {
        zipday[field.time] = daydata[k][field.time]
        out.push(copyArrayOfDeep(zipday))
        count = 0
      }
    }
  } // for i
  if (count > 0) {
    zipday[field.time] = daydata[daydata.length - 1][field.time]
    out.push(copyArrayOfDeep(zipday))
  }
  return out
}
// 日线到周线
export function matchDayToWeek (daydata) {
  const out = []
  const zipday = []

  const field = FIELD_DAY
  let isBegin = true
  for (let k = 0; k < daydata.length; k++) {
    if (isBegin) {
      zipday[field.open] = daydata[k][field.open]
      zipday[field.high] = daydata[k][field.high]
      zipday[field.low] = daydata[k][field.low]
      isBegin = false
    } else {
      zipday[field.high] = zipday[field.high] > daydata[k][field.high]
        ? zipday[field.high] : daydata[k][field.high]
      zipday[field.low] = zipday[field.low] < daydata[k][field.low] || daydata[k][field.low] === 0
        ? zipday[field.low] : daydata[k][field.low]
    }
    zipday[field.close] = daydata[k][field.close]
    zipday[field.vol] = daydata[k][field.vol]
    zipday[field.money] = daydata[k][field.money]

    // 周五 or 下一个日期跨越一周
    const week = getDayWeek(daydata[k][field.time])
    if (k >= daydata.length - 1 || week === 5 ||
      (getDayGap(daydata[k][field.time], daydata[k + 1][field.time]) + week > 7)) {
      zipday[field.time] = daydata[k][field.time]
      out.push(copyArrayOfDeep(zipday))
      isBegin = true
    }
  } // for i
  if (!isBegin) {
    zipday[field.time] = daydata[daydata.length - 1][field.time]
    out.push(copyArrayOfDeep(zipday))
  }
  return out
}

// 日线到月线
export function matchDayToMon (daydata) {
  let month
  const out = []
  const zipday = []

  const field = FIELD_DAY
  let isBegin = true
  for (let k = 0; k < daydata.length; k++) {
    if (isBegin) {
      zipday[field.open] = daydata[k][field.open]
      zipday[field.high] = daydata[k][field.high]
      zipday[field.low] = daydata[k][field.low]
      month = getDayMon(daydata[k][field.time])
      isBegin = false
    } else {
      zipday[field.high] = zipday[field.high] > daydata[k][field.high]
        ? zipday[field.high] : daydata[k][field.high]
      zipday[field.low] = zipday[field.low] < daydata[k][field.low] || daydata[k][field.low] === 0
        ? zipday[field.low] : daydata[k][field.low]
    }
    zipday[field.close] = daydata[k][field.close]
    zipday[field.vol] = daydata[k][field.vol]
    zipday[field.money] = daydata[k][field.money]

    if (k >= daydata.length - 1 || getDayMon(daydata[k + 1][field.time]) !== month) {
      zipday[field.time] = daydata[k][field.time]
      out.push(copyArrayOfDeep(zipday))
      isBegin = true
    }
  } // for i
  if (!isBegin) {
    zipday[field.time] = daydata[daydata.length - 1][field.time]
    out.push(copyArrayOfDeep(zipday))
  }
  return out
}

// 求交易时间的总共分钟数 [{begin:930,end:1130},{...}]
export function getMinuteCount (tradetime) { // time_t
  let mincount = 0
  for (let i = 0; i < tradetime.length; i++) {
    mincount += getMinuteGap(tradetime[i].begin, tradetime[i].end)
  }
  return mincount
}

// 根据交易时间把time_t返回一个顺序值 time_t --> 0..239 -1表示没有非交易时间
export function fromTradeTimeToIndex (ttime, tradetime) { // time_t 返回０－２３９
  const minute = getMinute(ttime)

  let nowmin = 0
  let index = -1
  for (let i = 0; i < tradetime.length; i++) {
    // 9:31:00--11:29:59  13:01:00--14:59:59
    if (minute > tradetime[i].begin && minute < tradetime[i].end) {
      index = nowmin + getMinuteGap(tradetime[i].begin, minute)
      break
    }
    if (minute <= tradetime[i].begin && i === 0) { // 8:00:00---9:30:59秒前都=0
      return 0
    }
    if (minute <= tradetime[i].begin && (minute > getMinuteOffset(tradetime[i].begin, -5))) { // 12:55:59--13:00:59秒
      return nowmin
    }

    nowmin += getMinuteGap(tradetime[i].begin, tradetime[i].end)

    if (minute >= tradetime[i].end && i === tradetime.length - 1) { // 15:00:00秒后
      return nowmin - 1
    }
    if (minute >= tradetime[i].end && (minute < getMinuteOffset(tradetime[i].end, 5))) { // 11:30:00--11:34:59秒
      return nowmin - 1
    }
  }
  return index
}

// 根据交易时间把0..239 转换为 time_t;  0 表示没有非交易时间
export function fromIndexToTradeTime (tindex, tradetime, tradeDate) {
  let index = tindex
  let offset = 0
  let nowmin = 0
  for (let i = 0; i < tradetime.length; i++) {
    nowmin = getMinuteGap(tradetime[i].begin, tradetime[i].end)
    if (index < nowmin) {
      offset = getMinuteOffset(tradetime[i].begin, index + 1)
      const ttime = new Date(Math.floor(tradeDate / 10000), Math.floor(tradeDate % 10000 / 100) - 1, tradeDate % 100,
        Math.floor(offset / 100), offset % 100, 0)
      return Math.floor(ttime / 1000)
    }
    index -= nowmin
  }
  return 0
}

export function outputDay5 (source, coinunit, tradetime) {
  const out = {
    key: 'DAY5',
    fields: FIELD_DAY5,
    value: []
  }
  if (source.length < 1) return out

  let idx
  let count = 0
  let vol = 0
  let money = 0
  let curDate = 0
  const daymins = getMinuteCount(tradetime)
  for (idx = 0; idx < source.length; idx++) {
    if (curDate !== getDate(source[idx][FIELD_TICK.time])) {
      curDate = getDate(source[idx][FIELD_TICK.time])
      count++
      vol = 0
      money = 0
    }
    vol += source[idx][FIELD_TICK.vol]
    money += source[idx][FIELD_TICK.close] * source[idx][FIELD_TICK.vol] / coinunit
    let index = fromTradeTimeToIndex(source[idx][FIELD_TICK.time], tradetime)
    index += (count - 1) * daymins
    out.value.push([index, source[idx][FIELD_TICK.close], source[idx][FIELD_TICK.vol], money / vol])
  }
  return out
}
