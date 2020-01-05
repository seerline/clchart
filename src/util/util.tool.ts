/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface Rect {
  left: number
  top: number
  width: number
  height: number
}

export interface Offset {
  left: number
  top: number
  right: number
  bottom: number
}

export interface Point {
  x: number
  y: number
}

// 随机生成 ID
function makeId(size: number) {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  if (size > 20) size = 20
  for (let i = 0; i < size; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

// 日期转换成time_t
function dayToTTime(day: number): number {
  const mtime = new Date(Math.floor(day / 10000), Math.floor((day % 10000) / 100) - 1, day % 100)
  return mtime.getTime() / 1000
}

// 添加前缀，n 表示总共几位，例如：addPreZero(9,2) --> 09
export function addPreZero(v: number, n: number): string {
  n = n > 9 ? 9 : n
  const s = '000000000' + v
  return s.slice(-1 * n)
}

// 获取时间对象
export function getDateTime(ttime?: string | number): Date {
  let mtime = new Date()
  if (!ttime) {
    return mtime
  }
  if (typeof ttime === 'string') {
    const seconds = parseInt(ttime, 10)
    if (!isNaN(seconds)) {
      mtime = new Date(seconds * 1000)
    }
  }
  return mtime
}

// 输入日期和时间，获取转换为秒，例如：makeTimeT(20011010, 120000) --> 1002686400
export function makeTimeT(tdate: number, ttime: number): number {
  const year = Math.floor(tdate / 10000)
  const month = Math.floor((tdate % 10000) / 100)
  const day = Math.floor(tdate % 100)

  const hour = Math.floor(ttime / 10000)
  const minute = Math.floor((ttime % 10000) / 100)
  const sec = Math.floor(ttime % 100)

  const dateStr = `${year}/${month}/${day} ${hour}:${minute}:${sec}`
  return new Date(dateStr).getTime() / 1000
}

// time_t转换成 20180101 格式
export function getDate(ttime?: string | number): number {
  const mtime = getDateTime(ttime)
  return mtime.getFullYear() * 10000 + (mtime.getMonth() + 1) * 100 + mtime.getDate()
}

// time_t提取其中的分钟 1030
export function getMinute(ttime?: string | number): number {
  const mtime = getDateTime(ttime)
  return mtime.getHours() * 100 + mtime.getMinutes()
}

// 求星期几 0-周日 6-周六
export function getDayWeek(day: number): number {
  const mtime = new Date(Math.floor(day / 10000), Math.floor((day % 10000) / 100) - 1, day % 100)
  return mtime.getDay()
}

// 求星期几 0-周日 6-周六
export function getDayMon(day: number): number {
  const mtime = new Date(Math.floor(day / 10000), Math.floor((day % 10000) / 100) - 1, day % 100)
  return mtime.getMonth() + 1
}

// 得到两个日期间隔的天数
export function getDayGap(beginDay: number, endDay: number): number {
  return Math.floor((dayToTTime(endDay) - dayToTTime(beginDay)) / (24 * 3600))
}

// 格式化time_t为指定字符串
export function fromTTimeToStr(
  ttime: number | string,
  format: string,
  ttimePre?: number | string
): string {
  const mtime = getDateTime(ttime)
  switch (format) {
    case 'minute':
      if (ttimePre === undefined) {
        return mtime.getHours() + ':' + addPreZero(mtime.getMinutes(), 2)
      } else {
        if (getMinute(ttime) === getMinute(ttimePre)) {
          return ':' + addPreZero(mtime.getSeconds(), 2)
        } else {
          return mtime.getHours() + ':' + addPreZero(mtime.getMinutes(), 2)
        }
      }
    case 'datetime':
      return (
        mtime.getFullYear() * 10000 +
        (mtime.getMonth() + 1) * 100 +
        mtime.getDate() +
        '-' +
        mtime.getHours() +
        ':' +
        addPreZero(mtime.getMinutes(), 2)
      )
    default:
      return ''
  }
}

// 分钟转字符串 1500 -- 15:00
export function fromMinuteToStr(minute: number): string {
  return (
    addPreZero(Math.floor(minute / 100), 2).toString() +
    ':' +
    addPreZero(minute % 100, 2).toString()
  )
}

// 得到间隔分钟数
export function getMinuteGap(beginMin: number, endMin: number): number {
  return (
    (Math.floor(endMin / 100) - Math.floor(beginMin / 100)) * 60 + (endMin % 100) - (beginMin % 100)
  )
}

// 偏移分钟数，offset 为分钟数
export function getMinuteOffset(minute: number, offset: number): number {
  const mincount = Math.floor(minute / 100) * 60 + (minute % 100) + offset
  return Math.floor(mincount / 60) * 100 + (mincount % 60)
}

// 公用无关性的函数集合
// Todo
// 复制数据
export function copyArrayOfDeep(obj: any) {
  let out: any
  if (Array.isArray(obj)) {
    out = []
    const len = obj.length
    for (let i = 0; i < len; i++) {
      out[i] = copyArrayOfDeep(obj[i])
    }
  } else {
    out = obj
  }
  return out
}

// 数组是否为空
export function isEmptyArray(obj: any): boolean {
  if (obj && Array.isArray(obj)) {
    if (obj.length > 0) return false
  }
  return true
}

// 根据offset返回一个新的矩形
// rect:{left,top,width,height}
// offset:{left,top,right,bottom}
export function offsetRect(rect?: Rect, offset?: Offset): Rect {
  if (!rect) return { left: 0, top: 0, width: 0, height: 0 }
  if (!offset) return rect
  return {
    left: rect.left + offset.left,
    top: rect.top + offset.top,
    width: rect.width - (offset.left + offset.right),
    height: rect.height - (offset.top + offset.bottom)
  }
}

// 判断点是否在矩形内
export function inRect(rect?: Rect, point?: Point): boolean {
  if (!rect || !point) return false
  if (
    point.x >= rect.left &&
    point.y >= rect.top &&
    point.x < rect.left + rect.width &&
    point.y < rect.top + rect.height
  ) {
    return true
  }
  return false
}

// 判断X是否在矩形宽度范围内
export function inRangeX(rect?: Rect, x?: number): boolean {
  if (!rect || !x) return false
  if (x >= rect.left && x < rect.left + rect.width) {
    return true
  }
  return false
}

// 判断Y是否在矩形高度范围内
export function inRangeY(rect?: Rect, y?: number): boolean {
  if (!rect || !y) return false
  if (y >= rect.top && y < rect.top + rect.height) {
    return true
  }
  return false
}

// 判断 v 是否在数组 arr中
export function inArray(v: any, arr: any[]): boolean {
  return arr.includes(v)
}

// 求数组 a 和 b 的交集
export function intersectArray(a: any[], b: any[]) {
  const result = []
  for (let ai = 0; ai < a.length; ai++) {
    for (let bi = 0; bi < b.length; bi++) {
      if (a[ai] === b[bi]) {
        result.push(a[ai])
        break
      }
    }
  }
  return result
}

// 求数组 a 和 b 的并集，去掉重复的元素
export function mergeArray(a: any[], b: any[]) {
  const result = []
  for (let ai = 0; ai < a.length; ai++) {
    result.push(a[ai])
  }
  for (let bi = 0; bi < b.length; bi++) {
    if (!inArray(b[bi], result)) {
      result.push(b[bi])
    }
  }
  return result
}

// 是否是 null 或者 undeifned
export function isNullOrUndefined(val: any): boolean {
  return val === null || val === undefined
}

// 格式化百分比
export function formatRate(value?: number | string, zero?: number): string {
  if (!value || !zero) return '--'
  if (typeof value === 'string') value = parseFloat(value)

  const result = Math.abs(((value - zero) / zero) * 100)
  return result.toFixed(2) + '%'
}

// 格式化成交量
export function formatVolume(value?: number | string, volzoom?: number): string {
  if (!value || !volzoom) return '--'

  if (typeof value === 'string') value = parseFloat(value)

  if (volzoom) volzoom = 1
  let result = value / volzoom

  if (result > 100000000000) return (result / 100000000).toFixed(0) + '亿'
  else if (result > 10000000000) return (result / 100000000).toFixed(1) + '亿'
  else if (result > 1000000000) return (result / 100000000).toFixed(2) + '亿'
  else if (result > 100000000) return (result / 100000000).toFixed(3) + '亿'
  else if (result > 10000000) return (result / 10000).toFixed(0) + '万'
  else if (result > 1000000) return (result / 10000).toFixed(1) + '万'
  else if (result > -0.000000001 && result < 0.000000001) return '0'
  else return result.toFixed(0)
}

// 格式化价格 decimal 为小数点，limit为最大长度[4,10]，
export function formatPrice(value?: number, coindot?: number, limit?: number, isopen?: boolean) {
  if (value === undefined || isNaN(value)) return '--'
  let result = String(value)
  if (coindot === undefined || coindot < 0 || coindot > 10) coindot = 0
  if (value > -0.000000001 && value < 0.000000001 && !isopen) {
    return '--'
  }
  result = value.toFixed(coindot)
  if (limit === undefined || limit < 4) return result
  return result.substr(0, limit)
}

// 格式化时间
export function formatShowTime(key: string, value: number | string, minute?: number) {
  let out = value
  switch (key) {
    case 'M5':
    case 'M15':
    case 'M30':
    case 'M60':
      out = fromTTimeToStr(value, 'datetime')
      break
    case 'MIN':
      if (minute === undefined) {
        out = fromTTimeToStr(value, 'minute')
      } else {
        out = fromMinuteToStr(minute)
      }
      break
    case 'MDAY':
      out = fromTTimeToStr(value, 'minute')
      break
    case 'DAY':
    case 'dayddx':
      out = value
      break
    default:
      if (minute === undefined) {
        out = fromTTimeToStr(value, 'minute')
      } else {
        out = fromMinuteToStr(minute)
      }
      break
  }
  return out
}

// 格式化 info 数据
export function formatInfo(
  value: number,
  format: string,
  coindot?: number,
  volzoom?: number,
  middle?: number
) {
  let out
  if (format === 'rate') {
    out = formatRate(value, middle)
  } else {
    if (format === 'price') {
      if (coindot === undefined) coindot = 2
      out = formatPrice(value, coindot, 7)
    } else {
      if (volzoom === undefined) volzoom = 1
      out = formatVolume(value, volzoom)
    }
  }
  return out
}

// 复制 json 对象
export function copyJsonOfDeep(obj: any) {
  let out: any
  if (obj instanceof Object) {
    if (Array.isArray(obj)) {
      out = copyArrayOfDeep(obj)
    } else {
      out = {}
      for (const key in obj) {
        out[key] = copyJsonOfDeep(obj[key])
      }
    }
  } else {
    out = obj
  }
  return out
}

export function isValue(obj?: any): boolean {
  if (obj === undefined) return false
  return true
}

// obj为子集，生成新的对象，仅仅替换source中存在的对应元素
// 例如 obj = {a:[111],b:2} source = {a:[1,2,3]}
// out = {a:[111,2,3]}
export function updateJsonOfDeep(obj: any, source: any) {
  let out: any
  if (source instanceof Object) {
    if (Array.isArray(source)) {
      out = []
      for (const key in source) {
        out[key] =
          isValue(obj) && isValue(obj[key])
            ? updateJsonOfDeep(obj[key], source[key])
            : copyArrayOfDeep(source[key])
      }
    } else {
      out = {}
      for (const key in source) {
        out[key] =
          isValue(obj) && isValue(obj[key])
            ? updateJsonOfDeep(obj[key], source[key])
            : copyJsonOfDeep(source[key])
      }
    }
  } else {
    out = isValue(obj) ? obj : source
  }
  return out
}

// obj为原始集，不生成新的对象，用source中存在的对应元素替换obj的数据
// 例如 obj = {a:[111],b:2} source = {a:[1,2,3]}
// out = {a:[111,2,3],b:2}
export function mergeJsonOfDeep(obj: any, source: any) {
  const out = updateJsonOfDeep(obj, source)
  for (const key in obj) {
    if (out[key] !== undefined) continue
    if (obj[key] instanceof Object) {
      if (Array.isArray(obj[key])) {
        out[key] = copyArrayOfDeep(obj[key])
      } else {
        out[key] = copyJsonOfDeep(obj[key])
      }
    } else {
      out[key] = obj[key]
    }
  }
  return out
}
