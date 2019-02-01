/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** @module SystemConfig */

import {
  copyJsonOfDeep
} from '../util/cl.tool'
import {
  _globalUserClassDefine
} from '../plugins/cl.register'
import ClChartLine from './cl.chart.line'
import ClChartBoard from './cl.chart.board'

import * as drawClass from '../util/cl.draw'

/**
 * @constant
 */
export const COLOR_WHITE = {
  sys: 'white',
  line: ['#4048cc', '#dd8d2d', '#168ee0', '#ad7eac', '#ff8290', '#ba1215'],
  back: '#fafafa',
  txt: '#2f2f2f',
  baktxt: '#2f2f2f',
  axis: '#7f7f7f',
  cursor: '#7f7f7f',
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
/**
 * @constant
 */
export const COLOR_BLACK = {
  sys: 'black',
  line: ['#efefef', '#fdc104', '#5bbccf', '#ad7eac', '#bf2f2f', '#cfcfcf'],
  back: '#232323',
  txt: '#bfbfbf',
  baktxt: '#2f2f2f',
  axis: '#afafaf',
  cursor: '#afafaf',
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
/**
 * @constant
 */
export const CHART_WIDTH_MAP = {
  '0': {
    'width': 7.1999969482421875
  },
  '1': {
    'width': 4.8119964599609375
  },
  '2': {
    'width': 7.1999969482421875
  },
  '3': {
    'width': 7.1999969482421875
  },
  '4': {
    'width': 7.1999969482421875
  },
  '5': {
    'width': 7.1999969482421875
  },
  '6': {
    'width': 7.1999969482421875
  },
  '7': {
    'width': 6.563995361328125
  },
  '8': {
    'width': 7.1999969482421875
  },
  '9': {
    'width': 7.1999969482421875
  },
  '.': {
    'width': 3.167999267578125
  },
  ',': {
    'width': 3.167999267578125
  },
  '%': {
    'width': 11.639999389648438
  },
  ':': {
    'width': 3.167999267578125
  },
  ' ': {
    'width': 3.9959869384765625
  },
  'K': {
    'width': 8.279998779296875
  },
  'V': {
    'width': 7.667999267578125
  },
  'O': {
    'width': 9.203994750976562
  },
  'L': {
    'width': 7.055999755859375
  },
  '-': {
    'width': 7.2599945068359375
  },
  '[': {
    'width': 3.9959869384765625
  },
  ']': {
    'width': 3.9959869384765625
  }
}

/**
 * The following several variables must be established when the system is established, which is a common configuration for everyone.
 */
const _systemInfo = {
  runPlatform: 'normal', // 'react-native' | 'mina' | 'web'
  axisPlatform: 'web', // 'web' | 'phone'
  eventPlatform: 'web', // 'react-native' | 'mina' | 'web'
  scale: 1, // Set the zoom ratio according to the dpi of different display devices
  standard: 'china', // 'usa' | 'china' Drawing standards to support the United States and China
  sysColor: 'black', // 'white' | 'black'
  charMap: CHART_WIDTH_MAP, // Used to help degrade font width calculations for some platforms that do not support context measures
  mainCanvas: {}, // Main canvas
  cursorCanvas: {}, // Cursor canvas
  sysClass :{
    'system': {
      'normal' : ClChartLine,
      'chart' : ClChartLine,
      'board' : ClChartBoard,
    }
  }
}
/**
 * set paint standard
 * @export
 * @param {any} standard
 */
export function setStandard (standard) {
  _systemInfo.standard = standard || 'china'
}
/**
 * set system color
 * @export
 * @param {String} syscolor drawing theme
 * @returns system color
 */
export function setColor (syscolor) {
  let color = {}
  if (syscolor === 'white') {
    color = copyJsonOfDeep(COLOR_WHITE)
  } else {
    color = copyJsonOfDeep(COLOR_BLACK)
  }
  // The contrast between the rise and fall of the US market and the Chinese market is opposite
  if (_systemInfo.standard === 'usa') {
    const clr = color.red
    color.red = color.green
    color.green = clr
  }
  // Update the current system color
  _systemInfo.color = color
  return color
}
/**
 * Used to help those platforms that don't support measureText, degraded calculation font span
 * @export
 * @param {Object} context canvas context
 * @param {String} txt text
 * @param {String} font font family
 * @param {Number} pixel font size
 * @return {Number} text width
 */
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
/**
 * set system scale
 * @export
 * @param {Object} canvas
 * @param {Number} scale
 * @return {Object}
 */
export function setScale (canvas, scale) {
  canvas.width = canvas.clientWidth * scale
  canvas.height = canvas.clientHeight * scale
  return {
    width: canvas.width,
    height: canvas.height
  }
}
/**
 * init system
 * @export
 * @param {Object} cfg system config
 * @return {Object} all system config
 */
export function initSystem (cfg) {
  if (cfg === undefined) return
  for (const key in _systemInfo) {
    _systemInfo[key] = cfg[key] || _systemInfo[key]
  }
  _systemInfo.mainCanvas.canvas = cfg.mainCanvas.canvas
  _systemInfo.mainCanvas.context = cfg.mainCanvas.context
  _systemInfo.mainCanvas.context.charMap = _systemInfo.charMap
  _systemInfo.cursorCanvas.canvas = cfg.cursorCanvas.canvas
  _systemInfo.cursorCanvas.context = cfg.cursorCanvas.context
  _systemInfo.cursorCanvas.context.charMap = _systemInfo.charMap

  _systemInfo.color = setColor(_systemInfo.sysColor)

  if (_systemInfo.runPlatform === 'normal') {
    if (_systemInfo.mainCanvas.canvas !== undefined && _systemInfo.scale !== 1) {
      setScale(_systemInfo.mainCanvas.canvas, _systemInfo.scale)
      setScale(_systemInfo.cursorCanvas.canvas, _systemInfo.scale)
    }
  }
  return _systemInfo
}

/**
 * Bind some basic properties when some chart objects are initialized
 * @export
 * @param {Object} chart
 * @param {Object} father
 */
export function initCommonInfo (chart, father) {
  chart.father = father
  chart.context = father.context
  chart.scale = _systemInfo.scale
  chart.color = _systemInfo.color
  chart.axisPlatform = _systemInfo.axisPlatform
  chart.eventPlatform = _systemInfo.eventPlatform
}
/**
 * checkout layout
 * @export
 * @param {Object} layout
 */
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
/**
 * Change mouse style
 * @export
 * @param {String} style
 */
export function changeCursorStyle (style) {
  if (_systemInfo.eventPlatform === 'html5') {
    _systemInfo.mainCanvas.canvas.style.cursor = style
    _systemInfo.cursorCanvas.canvas.style.cursor = style
  }
}
/**
 * Get system line color
 * @export
 * @param {Number} index
 * @return {String}
 */
export function getLineColor (index) {
  if (index === undefined) index = 0
  return _systemInfo.color.line[index % _systemInfo.color.line.length]
}

// 所有的类都在这里定义，不管是系统的还是用户自定义的，

export function _registerPlugins (userName, className, classEntity) {
  if (userName === undefined || _systemInfo.sysClass[userName])
  {
    _systemInfo.sysClass[userName] = {};
  } 
  _systemInfo.sysClass[userName][className] = classEntity;
  console.log(_systemInfo.sysClass);
}

export function _createClass (className, father) {
  let classList = className.split('.');
  if (classList .length < 1) 
  {
    return new _systemInfo.sysClass['system']['normal'](father);
  }
  let userName = 'system'
  let entityName = ''
  if (classList.length === 1) 
  {
    if (_systemInfo.sysClass['system'][className] === undefined)
    {
      return new _systemInfo.sysClass['system']['normal'](father);
    }
    return new _systemInfo.sysClass['system'][className](father);
  }

  userName = classList.shift()
  entityName = classList.toString();
  // 先找系统中的，没有就找user定义的，再没有就调默认的
  if (_systemInfo.sysClass[userName]&&_systemInfo.sysClass[userName][entityName])
  {
    return new _systemInfo.sysClass[userName][entityName](father);
  } else if (_globalUserClassDefine[userName]&&_globalUserClassDefine[userName][entityName])
  {
    return new _globalUserClassDefine[userName][entityName](father);
  }
  return new _systemInfo.sysClass['system']['normal'](father);
}