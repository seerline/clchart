'use strict'

import {
  copyJsonOfDeep
} from '../util/cl.tool'

// ///////////////////////////
//  这里是定义的一些公共变量，以及调用方法
// ///////////////////////////

// 以下的几个变量都是系统确立时就必须确立的，属于大家通用的配置
export let _systemInfo = {
  runPlatform: 'normal', // 支持其他平台，其他平台（如微信）可能需要做函数替代和转换
  axisPlatform: 'phone', // 'web' 对坐标显示的区别
  eventPlatform: 'html5', // 'react'所有事件
  scale: 1, // 屏幕的放大倍数，该常量会经常性使用，并且是必须的
  standard: 'china', // 画图标准，美国’usa‘，需要调整颜色
  sysColor: 'black' // 色系，分白色和黑色系
}

export const COLOR_WHITE = {
  sys: 'white',
  line: ['#4048cc', '#dd8d2d', '#168ee0', '#ad7eac', '#ff8290', '#ba1215'],
  back: '#fafafa',
  txt: '#2f2f2f',
  baktxt: '#2f2f2f',
  axis: '#7f7f7f',
  grid: '#cccccc',
  red: '#ff6a6c',
  green: '#32cb47',
  white: '#7e7e7e',
  vol: '#dd8d2d',
  button: '#888888',
  colume: '#41bfd0',
  box: '#ddf4df',
  code: '#3f3f3f'
}

export const COLOR_BLACK = {
  sys: 'black',
  line: ['#efefef', '#fdc104', '#5bbccf', '#ad7eac', '#bf2f2f', '#cfcfcf'],
  back: '#232323',
  txt: '#bfbfbf',
  baktxt: '#2f2f2f',
  axis: '#afafaf',
  grid: '#373737',
  red: '#ff6a6c',
  green: '#6ad36d',
  white: '#9f9f9f',
  vol: '#fdc104',
  button: '#9d9d9d',
  colume: '#41bfd0',
  box: '#373737',
  code: '#41bfd0'
}

export function setStandard (standard) {
  _systemInfo.standard = standard || 'china'
}

export function setColor (syscolor) {
  let color = {}
  if (syscolor === 'white') {
    color = copyJsonOfDeep(COLOR_WHITE)
    // color.line = copyArrayOfDeep(COLOR_WHITE.line)
  } else {
    color = copyJsonOfDeep(COLOR_BLACK)
    // color.line = copyArrayOfDeep(COLOR_BLACK.line)
  }
  // 当发现国别为美国需要修改颜色配对
  if (_systemInfo.standard === 'usa') {
    const clr = color.red
    color.red = color.green
    color.green = clr
  }
  // 更新当前系统的颜色
  _systemInfo.color = color
  return color
}
export function initSystem (cfg) {
  if (cfg !== undefined) {
    if (cfg.canvas !== undefined && cfg.scale !== 1) {
      setScale(cfg.canvas, cfg.scale)
      _systemInfo.canvas = cfg.canvas
    }
    _systemInfo.context = cfg.context
    for (const key in _systemInfo) {
      _systemInfo[key] = cfg[key] || _systemInfo[key]
    }
  }
  _systemInfo.color = setColor(_systemInfo.sysColor, _systemInfo.standard)
}

// 所有chart都必须调用这个函数，以获取基本的配置
export function initCommonInfo (chart, father) {
  chart.father = father
  chart.context = father.context
  chart.scale = _systemInfo.scale
  chart.color = _systemInfo.color
  chart.axisPlatform = _systemInfo.axisPlatform
  chart.eventPlatform = _systemInfo.eventPlatform
}
export function checkLayout (layout) {
  const scale = _systemInfo.scale
  layout.margin.top *= scale
  layout.margin.left *= scale
  layout.margin.bottom *= scale
  layout.margin.right *= scale

  layout.offset.top *= scale
  layout.offset.left *= scale
  layout.offset.bottom *= scale
  layout.offset.right *= scale

  layout.title.pixel *= scale
  layout.title.height *= scale
  layout.title.spaceX *= scale
  layout.title.spaceY *= scale

  if (layout.title.height < (layout.title.pixel + layout.title.spaceY + 2 * scale)) {
    layout.title.height = layout.title.pixel + layout.title.spaceY + 2 * scale
  }

  layout.axisX.pixel *= scale
  layout.axisX.width *= scale
  layout.axisX.height *= scale
  layout.axisX.spaceX *= scale

  layout.scroll.pixel *= scale
  layout.scroll.size *= scale
  layout.scroll.spaceX *= scale

  layout.digit.pixel *= scale
  layout.digit.height *= scale
  layout.digit.spaceX *= scale

  if (layout.digit.height < (layout.digit.pixel + 2 * scale)) {
    layout.digit.height = layout.digit.pixel + 2 * scale
  }

  layout.symbol.size *= scale
  layout.symbol.spaceX *= scale
  layout.symbol.spaceY *= scale
}
// 改变鼠标样式
// default
export function changeCursorStyle (style) {
  if (_systemInfo.eventPlatform === 'html5') {
    _systemInfo.canvas.style.cursor = style
  }
}

export function setScale (canvas, scale) {
  canvas.width = canvas.clientWidth * scale
  canvas.height = canvas.clientHeight * scale
  return {
    width: canvas.width,
    height: canvas.height
  }
}
