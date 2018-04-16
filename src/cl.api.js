'use strict';

import ClChart from './chart/cl.chart.base';
import ClEvent from './event/cl.event';
import ClData from './data/cl.data';

import * as ClChartCFG from './cl.chart.cfg';
import * as ClDataCFG from './cl.data.cfg';

import {
  copyJsonOfDeep,
  updateJsonOfDeep
} from './util/cl.tool';

export const CFG_CHART = ClChartCFG;
export const CFG_DATA = ClDataCFG;

// 以下的几个变量都是系统确立时就必须确立的，属于大家通用的配置
export let _systemInfo = {
  runPlatform: 'normal', // 支持其他平台，其他平台（如微信）可能需要做函数替代和转换
  axisPlatform: 'phone', // 'web' 对坐标显示的区别
  eventPlatform: 'html5', // 'react'所有事件
  scale: 1, // 屏幕的放大倍数，该常量会经常性使用，并且是必须的
  standard: 'china',  // 画图标准，美国’usa‘，需要调整颜色
  sysColor: 'black'  // 色系，分白色和黑色系
}

// ///////////////////////////
//  下面是一个接口API函数
// ///////////////////////////

export function setColor(syscolor, standard) {
  let color = {};
  if (syscolor === 'white') {
    color = copyJsonOfDeep(ClChartCFG.COLOR_WHITE);
  } else {
    color = copyJsonOfDeep(ClChartCFG.COLOR_BLACK);
  }
  // 当发现国别为美国需要修改颜色配对
  if (standard === 'usa') {
    const clr = color.red;
    color.red = color.green;
    color.green = clr;
  }
  return color;
}
function _initSystem(cfg) {
  if (cfg !== undefined) {
    _systemInfo = updateJsonOfDeep(cfg, _systemInfo);
  }
  _systemInfo.color = setColor(_systemInfo.sysColor, _systemInfo.standard);
}

// 所有chart都必须调用这个函数，以获取基本的配置
export function initCommonInfo(chart, father) {
  chart.father = father;
  chart.context = father.context;
  chart.scale = _systemInfo.scale;
  chart.color = _systemInfo.color;
  chart.axisPlatform = _systemInfo.axisPlatform;
  chart.eventPlatform = _systemInfo.eventPlatform;
}
export function checkLayout(layout) {
  const scale = _systemInfo.scale;
  layout.margin.top *= scale;
  layout.margin.left *= scale;
  layout.margin.bottom *= scale;
  layout.margin.right *= scale;

  layout.offset.top *= scale;
  layout.offset.left *= scale;
  layout.offset.bottom *= scale;
  layout.offset.right *= scale;

  layout.title.pixel *= scale;
  layout.title.height *= scale;
  layout.title.spaceX *= scale;

  if (layout.title.height < (layout.title.pixel + 2 * scale)) {
    layout.title.height = layout.title.pixel + 2 * scale;
  }

  layout.axisX.pixel *= scale;
  layout.axisX.width *= scale;
  layout.axisX.height *= scale;
  layout.axisX.spaceX *= scale;

  layout.scroll.pixel *= scale;
  layout.scroll.size *= scale;
  layout.scroll.spaceX *= scale;

  layout.digit.pixel *= scale;
  layout.digit.height *= scale;
  layout.digit.spaceX *= scale;

  if (layout.digit.height < (layout.digit.pixel + 2 * scale)) {
    layout.digit.height = layout.digit.pixel + 2 * scale;
  }

  layout.symbol.pixel *= scale;
  layout.symbol.size *= scale;
  layout.symbol.spaceX *= scale;
  layout.symbol.spaceY *= scale;

  if (layout.symbol.size < (layout.symbol.pixel + 2 * scale)) {
    layout.symbol.size = layout.symbol.pixel + 2 * scale;
  }
}
// 改变鼠标样式
// default
export function changeCursorStyle(style) {
  if (_systemInfo.eventPlatform === 'html5') {
    _systemInfo.canvas.style.cursor = style;
  }
}
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
export function setScale (canvas, scale) {
  console.log(canvas.clientWidth, canvas.width);
  canvas.width = canvas.clientWidth * scale;
  canvas.height = canvas.clientHeight * scale;
  return {
    width: canvas.width,
    height: canvas.height
  };
}
export function createSingleChart(cfg) {
  if (cfg.canvas !== undefined && cfg.scale !== 1) {
    setScale(cfg.canvas, cfg.scale);
  }
  console.log(cfg)
  _initSystem(cfg);
  console.log(cfg)
  _systemInfo.canvas = cfg.canvas;
  // cfg.context.scale( 1 / cfg.scale, 1 / cfg.scale);
  const event = new ClEvent(_systemInfo);
  const chart = new ClChart(cfg.context);
  const data = new ClData();

  chart.initChart(data, event);
  return chart;
}
// ///////////////////////////////////
//   多股票同列的处理
//   context:  // 画布
//   canvas:   // 用于接受事件处理的
//   charts: [name1:{},name2:{},name2:{}...]
// 返回一组chart，每组chart按名字存在一个json数据结构里，方便使用
// ///////////////////////////////////
export function createMulChart(cfg) {
  _initSystem(cfg);
  const event = new ClEvent(_systemInfo);
  const chartList = {};
  for (const key in cfg.charts) {
    const chart = new ClChart(cfg.context);
    const data = new ClData();
    chart.initChart(data, event);
    chartList[key] = chart;
  }
  return chartList;
}