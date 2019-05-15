/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import ClChart from './chart/cl.chart'
import ClEvent from './event/cl.event'
import ClData from './data/cl.data'

import * as ClChartDef from './cl.chart.def'
import * as ClDataDef from './cl.data.def'
import ClPlugins from './plugins/cl.register'

import * as ClChartUtil from './util/cl.tool'

import * as ClDataUtil from './data/cl.data.tools'


import {
  initSystem
} from './chart/cl.chart.init'

import EV from './util/cl.ev'

/** @module ClChart */

/**
 * chart default defined
 * @export
 */
export const DEF_UTIL= ClChartUtil

export const DEF_DATA_UTIL= ClDataUtil

/**
 * chart default defined
 * @export
 */
export const DEF_CHART = ClChartDef
/**
 * data default defined
 * @export
 */
export const DEF_DATA = ClDataDef
/**
 * plugins
 * @export
 */
export const PLUGINS = ClPlugins

/**
 * utils
 * @export
 */
export const util = {
  EV
}

export function createCanvas (container) {
  const mainCanvas = document.createElement('canvas')
  const cursorCanvas = document.createElement('canvas')
  mainCanvas.style.width = '100%'
  mainCanvas.style.height = '100%'
  mainCanvas.style.position = 'absolute'
  mainCanvas.style.top = '0px'
  mainCanvas.style.left = '0px'
  cursorCanvas.style.width = '100%'
  cursorCanvas.style.height = '100%'
  cursorCanvas.style.position = 'absolute'
  cursorCanvas.style.top = '0px'
  cursorCanvas.style.left = '0px'
  container.style.position = 'relative'
  container.append(mainCanvas)
  container.append(cursorCanvas)
  return {
    mainCanvas: {
      canvas: mainCanvas,
      context: mainCanvas.getContext('2d')
    },
    cursorCanvas: {
      canvas: cursorCanvas,
      context: cursorCanvas.getContext('2d')
    }
  }
}

/**
 * create single stock chart
 * @export
 * @param {Object} cfg SystemConfig
 * @returns chart instance
 */
export function createSingleChart (cfg) {
  if (!cfg.mainCanvas) {
    const canvasDom = createCanvas(cfg.container)
    cfg = { ...cfg, ...canvasDom }
  }
  const sysInfo = initSystem(cfg)
  const chart = new ClChart(sysInfo)
  const event = new ClEvent(sysInfo)
  const data = new ClData()

  chart.initChart(data, event)
  return chart
}
/**
 * create mulit stocks chart
 * processing
 * @export
 * @param {any} cfg SystemConfig
 * @returns charts instance
 */
export function createMulChart (cfg) {
  const sysInfo = initSystem(cfg)
  const event = new ClEvent(sysInfo)
  const chartList = {}
  for (const key in cfg.charts) {
    const chart = new ClChart(sysInfo)
    const data = new ClData()
    chart.initChart(data, event)
    chartList[key] = chart
  }
  return chartList
}
