'use strict'

import {
  copyJsonOfDeep
} from '../util/cl.tool'

import * as drawClass from '../util/cl.draw'

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

export const CHART_WIDTH_MAP = {
  "0": {
    "width": 7.1999969482421875
  },
  "1": {
    "width": 4.8119964599609375
  },
  "2": {
    "width": 7.1999969482421875
  },
  "3": {
    "width": 7.1999969482421875
  },
  "4": {
    "width": 7.1999969482421875
  },
  "5": {
    "width": 7.1999969482421875
  },
  "6": {
    "width": 7.1999969482421875
  },
  "7": {
    "width": 6.563995361328125
  },
  "8": {
    "width": 7.1999969482421875
  },
  "9": {
    "width": 7.1999969482421875
  },
  ".": {
    "width": 3.167999267578125
  },
  ",": {
    "width": 3.167999267578125
  },
  "%": {
    "width": 11.639999389648438
  },
  ":": {
    "width": 3.167999267578125
  },
  " ": {
    "width": 3.9959869384765625
  },
  "K": {
    "width": 8.279998779296875
  },
  "V": {
    "width": 7.667999267578125
  },
  "O": {
    "width": 9.203994750976562
  },
  "L": {
    "width": 7.055999755859375
  },
  "-": {
    "width": 7.2599945068359375
  },
  "[": {
    "width": 3.9959869384765625
  },
  "]": {
    "width": 3.9959869384765625
  },
}

// ///////////////////////////
//  这里是定义的一些公共变量，以及调用方法
// ///////////////////////////

// 以下的几个变量都是系统确立时就必须确立的，属于大家通用的配置
export let _systemInfo = {
  runPlatform: 'normal', // 支持其他平台，其他平台（如微信）可能需要做函数替代和转换 react
  axisPlatform: 'web', // 'web' 对坐标显示的区别
  eventPlatform: 'html5', // 'react'所有事件
  scale: 1, // 屏幕的放大倍数，该常量会经常性使用，并且是必须的
  standard: 'china', // 画图标准，美国’usa‘，需要调整颜色
  sysColor: 'black', // 色系，分白色和黑色系
  charMap: CHART_WIDTH_MAP
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

export function _getOtherTxtWidth (context, txt, font, pixel) {
  const ww = _systemInfo.other.width
  const hh = _systemInfo.other.height
  drawClass._fillRect(0, 0, ww, hh, '#000')
  drawClass._drawTxt(_systemInfo.other.context, 0, 0, txt, font, pixel, '#fff')
  const imgData = _systemInfo.other.context.getImageData(0, 0, ww, hh).data
  let width = 0
  for (let i = 0; i < imgData.length; /* i += 4 */) {
    if (imgData.data[i + 0] !== 0 || imgData.data[i + 1] !== 0 ||
      imgData.data[i + 2] !== 0 || imgData.data[i + 3] !== 255) {
      i += 4
      width++
    } else {
      i += 4 * ww
    }
  }
  return width
}
export function redirectDrawTool (tools) {
  // const canvas = document.createComment('canvas')
  // canvas.width = 300 * _systemInfo.scale
  // canvas.height = 30 * _systemInfo.scale
  // _systemInfo.react.context = canvas.getContext('2d')
  // drawClass._getTxtWidth = tools.getTxtWidth
  drawClass._beforePaint = tools && tools.beforePaint
  drawClass._afterPaint = tools && tools.afterPaint
}

export function setScale (canvas, scale) {
  canvas.width = canvas.clientWidth * scale
  canvas.height = canvas.clientHeight * scale
  return {
    width: canvas.width,
    height: canvas.height
  }
}
export function initSystem (cfg) {
  if (cfg === undefined) return
  for (const key in _systemInfo) {
    _systemInfo[key] = cfg[key] || _systemInfo[key]
  }
  // _systemInfo.runPlatform = cfg.runPlatform
  // _systemInfo.axisPlatform = cfg.axisPlatform
  // _systemInfo.eventPlatform = cfg.eventPlatform
  // _systemInfo.scale = cfg.scale
  // _systemInfo.standard = cfg.standard
  // _systemInfo.sysColor = cfg.sysColor

  _systemInfo.canvas = cfg.canvas
  _systemInfo.context = cfg.context
  _systemInfo.context.charMap = _systemInfo.charMap
  _systemInfo.other = cfg.other // react 没有字体宽度的接口
  // { context, rectMain }

  _systemInfo.color = setColor(_systemInfo.sysColor, _systemInfo.standard)

  if (_systemInfo.runPlatform === 'normal') {
    if (_systemInfo.canvas !== undefined && _systemInfo.scale !== 1) {
      setScale(_systemInfo.canvas, _systemInfo.scale)
    }
  } else { // 不支持字体宽度
    redirectDrawTool(cfg.tools)
  }
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
