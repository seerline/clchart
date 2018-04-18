'use strict'

import ClChart from './chart/cl.chart'
import ClEvent from './event/cl.event'
import ClData from './data/cl.data'

import * as ClChartDef from './cl.chart.def'
import * as ClDataDef from './cl.data.def'
import ClPlugins from './plugins/cl.register'

import {
  initSystem
} from './chart/cl.chart.init'

export const DEF_CHART = ClChartDef
export const DEF_DATA = ClDataDef
export const PLUGINS = ClPlugins

// ///////////////////////////
//  以下区域用于加载plugins中的定义
// ///////////////////////////

// ///////////////////////////
//  下面是一个接口API函数
// ///////////////////////////
// 针对单一的Chart（一个股票对应一组数据图表）
// 多个股票对应多图需要各自设定对应关系
// cfg 为以下区域
//   runPlatform: 'normal', // 支持其他平台，其他平台（如微信）可能需要做函数替代和转换
//   axisPlatform: 'phone', // 'web' 对坐标显示的区别
//   eventPlatform: 'html5', // 'react'所有事件
//   scale: 1, // 屏幕的放大倍数，该常量会经常性使用，并且是必须的
//   standard: 'china',  // 画图标准，美国’usa‘，需要调整颜色
//   sysColor: 'black'  // 色系，分白色和黑色系
// ///////////////////////////////////
//   context:  // 画布
//   canvas:   // 用于接受事件处理的
// ///////////////////////////////////
export function createSingleChart (cfg) {
  initSystem(cfg)
  const chart = new ClChart(cfg.context)
  const event = new ClEvent(cfg)
  const data = new ClData()

  chart.initChart(data, event)
  return chart
}

// ///////////////////////////////////
//   多股票同列的处理
//   context:  // 画布
//   canvas:   // 用于接受事件处理的
//   charts: [name1:{},name2:{},name2:{}...]
// 返回一组chart，每组chart按名字存在一个json数据结构里，方便使用
// ///////////////////////////////////
export function createMulChart (cfg) {
  initSystem(cfg)
  const event = new ClEvent(cfg)
  const chartList = {}
  for (const key in cfg.charts) {
    const chart = new ClChart(cfg.context)
    const data = new ClData()
    chart.initChart(data, event)
    chartList[key] = chart
  }
  return chartList
}
