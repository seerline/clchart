'use strict'

// 数据类型和数据名称分开；根据数据类型生成
// 在comm中定义几个函数，用户可以自己定义数据类型，自己定义按钮，自己定义画线的方式，
// 只要用户产生的类支持通用的接口onpaint等函数，并成功注册进来，就可以被chart拿来画图了
// 这样扩展起来才方便
// 而chart.line只画基础的一些图形，其他非标的图形由用户自行定义，包括数据生成的算法

export const STOCK_TYPE_INDEX = 0
export const STOCK_TYPE_A = 1
export const STOCK_TYPE_B = 4
export const STOCK_TYPE_OTHER = 5

export const STOCK_TRADETIME = [{
  begin: 930,
  end: 1130
},
{
  begin: 1300,
  end: 1500
}
]

// 基本日线定义，历史分钟线，
export const FIELD_DAY = {
  time: 0,
  open: 1,
  high: 2,
  low: 3,
  close: 4,
  vol: 5,
  money: 6
}
export const FIELD_MIN = {
  idx: 0,
  open: 1,
  high: 2,
  low: 3,
  close: 4,
  vol: 5,
  money: 6,
  allvol: 5, // 增补
  allmoney: 6 // 增补
}

export const FIELD_TICK = {
  time: 0,
  close: 1,
  vol: 2
}
export const FIELD_DAY5 = {
  time: 0,
  close: 1,
  vol: 2,
  idx: 3, // 增补
  allvol: 4, // 增补
  allmoney: 5 // 增补
}

// 两种单线的定义
export const FIELD_LINE = {
  time: 0,
  value: 1
}
export const FIELD_ILINE = {
  idx: 0,
  value: 1
}

// 标准5档实时行情
export const FIELD_NOW = {
  time: 0,
  open: 1,
  high: 2,
  low: 3,
  close: 4,
  vol: 5,
  money: 6,
  buy1: 7,
  buyvol1: 8,
  sell1: 9,
  sellvol1: 10,
  buy2: 11,
  buyvol2: 12,
  sell2: 13,
  sellvol2: 14,
  buy3: 15,
  buyvol3: 16,
  sell3: 17,
  sellvol3: 18,
  buy4: 19,
  buyvol4: 20,
  sell4: 21,
  sellvol4: 22,
  buy5: 23,
  buyvol5: 24,
  sell5: 25,
  sellvol5: 26
}
// 简易一档实时行情
export const FIELD_ENOW = {
  time: 0,
  open: 1,
  high: 2,
  low: 3,
  close: 4,
  vol: 5,
  money: 6,
  buy1: 7,
  buyvol1: 8,
  sell1: 9,
  sellvol1: 10
}
// 指数实时行情
export const FIELD_NOW_IDX = {
  time: 0,
  open: 1,
  high: 2,
  low: 3,
  close: 4,
  vol: 5,
  money: 6,
  ups: 7,
  upvol: 8,
  downs: 9,
  downvol: 10,
  mids: 11,
  midvol: 12
}
// 股票CODE列表
export const FIELD_CODE = {
  index: 0,
  code: 1,
  name: 2, // 股票名称
  spell: 3, // 拼音首字母
  type: 4, // 股票类型
  decimal: 5, // 保留小数点
  volunit: 6, // 成交量单位
  before: 7, // 前收盘
  stophigh: 8, // 涨停价
  stoplow: 9 // 跌停价
}
// 股票信息定义
export const FIELD_INFO = {
  name: 0, // 股票名称
  type: 1, // 股票类型
  decimal: 2, // 保留小数点
  volunit: 3, // 成交量单位
  before: 4, // 前收盘
  stophigh: 5, // 涨停价
  stoplow: 6 // 跌停价
}

// 除权字段定义
export const FIELD_RIGHT = {
  time: 0,
  sendstock: 1, // 10送股 放大1000倍
  allotstock: 2, // 10配股数 放大1000倍
  allotprice: 3, // 配股价 放大1000倍
  accrual: 4 // 10送红利 放大1000倍
}
// 财务信息定义
export const FIELD_FINANCE = {
  code: 0,
  time: 1,
  flow: 2, // 流通股
  total: 3, // 总股本
  earnings: 4 // 每股收益
}
// ////////////////////////////////////////
// 以上为系统默认定义，用户定义数据类型可以放在下面
// ////////////////////////////////////////

export const FIELD_TRADE = {
  time: 0, // 交易时间
  code: 1, // 股票代码
  type: 2, // B S 买卖标志
  price: 3, // 交易价格
  vol: 4, // 成交量
  money: 5, // 成交金额
  info: 6 // 交易参数
}
