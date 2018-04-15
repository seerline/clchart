'use strict';

import ClChart from './chart/cl.chart.base';
import ClDrawKBar from './chart/cl.draw.kbar';
import ClDrawLine from './chart/cl.draw.line';
import ClDrawRight from './chart/cl.draw.right';
import ClDrawVBar from './chart/cl.draw.vbar';
import ClDrawVLine from './chart/cl.draw.vline';
import ClEvent from './event/cl.event';
import ClData from './data/cl.data';
import {
  copyJsonOfDeep,
  updateJsonOfDeep
} from './util/cl.tool';

// 以下的几个变量都是系统确立时就必须确立的，属于大家通用的配置
export let _systemInfo = {
  runPlatform: 'normal', // 支持其他平台，其他平台（如微信）可能需要做函数替代和转换
  axisPlatform: 'phone', // 'web' 对坐标显示的区别
  eventPlatform: 'html5', // 'react'所有事件
  scale: 1, // 屏幕的放大倍数，该常量会经常性使用，并且是必须的
  standard: 'china',  // 画图标准，美国’usa‘，需要调整颜色
  sysColor: 'black'  // 色系，分白色和黑色系
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
};

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
};

export const CFG_LAYOUT = {
  margin: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }, // 边界偏移值
  offset: {
    left: 2,
    top: 2,
    right: 2,
    bottom: 2
  }, // 实际画图区域的偏移值
  text: {
    pixel: 12,
    height: 18,
    spaceX: 10,
    font: 'sans-serif'
  }, // 标题文字的定义
  digit: {
    pixel: 12,
    height: 16,
    spaceX: 3,
    font: 'Arial'
  }, // 数字的定义
  symbol: {
    pixel: 10,
    size: 16,
    spaceX: 3,
    font: 'Arial'
  }// 标记的定义
};
// 按钮的预定义
export const CFG_BUTTONS = [
  { key: 'zoomin' },
  { key: 'zoomout' },
  { key: 'exright' }
];
// 滚动条的预定义
export const CFG_SCROLL = {
  display: 'horizontal', // none不显示 horizontal 横着显示 vertical 竖着显示
  size: 25    // 宽度或高度
};

// 预定义参数
export const CFG_ORDER = {
  showMode: 'normal', // 'tiny'只显示买一卖一 'normal' 5档买卖盘
  title: {
    display: 'text' // none 不显示 btn 按钮 text 文字
  }
};
// 预定义参数
export const CFG_CHART_KBAR = {
  // buttons: ['zoomin', 'exright', 'zoomout'],
  // title: { display: 'none' },
  // scroll: {display: 'none'},
  zoomInfo: {
    index: 3,
    list: [1, 2, 3, 5, 8, 13, 21]
  },
  title: {
    display: 'text', // none 不显示 btn 按钮 text 文字
    label: 'K线'   // 需要显示的文字信息
  },
  axisX: {
    lines: 0,
    display: 'none', // none不显示， both 两边各一个值, block ：根据lines每个块显示一个值 = 显示坐标
    type: 'normal', // 有 day1 当日 day5 5日线 和 normal:日线 三种模式
    // ??? 是否把这三种统一起来
    format: 'date',  // date time datetime normal tradetime(9:30) 根据交易时间此时 = 输出的信息格式
    width: 50       // 显示宽度，web下
  },
  axisY: {
    lines: 3,
    left: {
      display: 'both', // none不显示, both, noupper 不显示最上面, nofoot不显示最下面 = 显示坐标
      middle: 'none', // 是否有中间值 'before'=前收盘 ‘zero’ 0为中间值
      format: 'price'  // 输出数据的格式 rate, price 保留一定小数位 vol 没有小数
    },
    right: {
      display: 'both', // none不显示，noupper 不显示最上面, nofoot不显示最下面 = 显示坐标
      middle: 'none', // 是否有中间值 'before'=前收盘 ‘zero’ 0为中间值
      format: 'price'   // rate, price vol
    }
  },
  lines: [{
    // type: 'l_kbar',
    className: ClDrawKBar,
    extremum:{ // 如何取极值
      method: 'normal', // fixedLeft fixedRight 上下固定,此时需要取axisY.middle的定义
      maxvalue: ['high'],  // 参与计算最大值的标签
      minvalue: ['low']    // 参与计算最小值的标签
    }
    // 第一根线默认的key是跟随chart的hotKey变化而变化的，其他线要么自己有数据，要么根据hotKey加上公式计算出自己的key
  },
  {
    className: ClDrawRight,
  },
  {
    className: ClDrawLine,
    info: {  // 输出在信息栏目的数据
      txt: '5:',
      labelY: 'value',                  // 从key中获取对应的数据标签 用于显示信息用
      format: 'price'
    },
    formula: { // 数据生成方式，都需要基于基本数据，没有formula表示取绑定的数据
      key: 'DAYM1',     // 生成和获取数据的key，
      command: `out = this.MA('close',5)`  // 公式只能输出值到out中
    }
  },
  {
    className: ClDrawLine,
    info: {
      txt: '10:',
      labelY: 'value',
      format: 'price'
    },
    formula: {
      key: 'DAYM2',     // 获取数据的key，
      command: `out = this.MA('close',10)`  // 公式只能输出值到out中
    }
  },
  {
    className: ClDrawLine,
    info: {
      txt: '20:',
      labelY: 'value',
      format: 'price'
    },
    formula: {
      key: 'DAYM3',     // 获取数据的key，
      command: `out = this.MA('close',20)`  // 公式只能输出值到out中
    }
  },
  {
    className: ClDrawLine,
    info: {
      txt: '60:',
      labelY: 'value',
      format: 'price'
    },
    formula: {
      key: 'DAYM4',     // 获取数据的key，
      command: `out = this.MA('close',60)`  // 公式只能输出值到out中
    }
  }]
};

export const CFG_CHART_VBAR = {
  title: {
    display: 'text', // none 不显示 btn 按钮 text 文字
    label: 'VOL'   // 需要显示的文字信息
  },
  axisX: {
    lines: 0,
    display: 'both', // 左右两边显示
    type: 'normal', // 有 day1 day5 和 normal 三种模式
    format: 'date', // date time datetime normal tradetime：根据交易时间此时label无用 = 显示的信息方式
    width: 50 // 显示宽度，web下
  },
  axisY: {
    lines: 1,
    left: {
      display: 'nofoot',
      middle: 'none',
      format: 'vol'
    },
    right: {
      display: 'nofoot',
      middle: 'none',
      format: 'vol'
    }
  },
  lines: [{
    className: ClDrawVBar,
    extremum:{ // 如何取极值
      method: 'normal', // fixedLeft fixedRight 上下固定,此时需要取axisY.middle的定义
      maxvalue: ['vol'],  // 参与计算最大值的标签
      minvalue: [0]    // 参与计算最小值的标签
    },
    info: {
      labelY: 'vol',   // 需要显示的变量，从key中获取对应的数据标签
      format: 'vol'
    },
  },
  {
    className: ClDrawLine,
    info: {
      txt: '5:',
      labelY: 'value',   // 需要显示的变量，从key中获取对应的数据标签
      format: 'vol'
    },
    formula: {
      key: 'MVOL1',     // 获取数据的key，
      command: `out = this.MA('vol',5)`  // 公式只能输出值到out中
    }
  },
  {
    className: ClDrawLine,
    info: {
      txt: '10:',
      labelY: 'value',   // 需要显示的变量，从key中获取对应的数据标签
      format: 'vol'
    },
    formula: {
      key: 'MVOL2',     // 获取数据的key，
      command: `out = this.MA('vol',10)`  // 公式只能输出值到out中
    }
  },
  {
    className: ClDrawLine,
    info: {
      txt: '20:',
      labelY: 'value',   // 需要显示的变量，从key中获取对应的数据标签
      format: 'vol'
    },
    formula: {
      key: 'MVOL3',     // 获取数据的key，
      command: `out = this.MA('vol',20)`  // 公式只能输出值到out中
    }
  }]
};

export const CFG_CHART_NOW = {
  title: {
    display: 'none', // none 不显示 btn 按钮 text 文字
  },
  axisX: {
    lines: 3,
    display: 'none', // none不显示，sides：两边各一个值, block：根据块大小每个块显示一个值 = 显示坐标
    type: 'day1', // 有 day1 day5 和 normal 三种模式
    format: 'tradetime',
    width: 50       // 显示宽度，web下
  },
  axisY: {
    lines: 3,
    left: {
      display: 'both', // none不显示，all, noupper不显示最上面, nofoot不显示最下面 = 显示坐标
      middle: 'before', // 是否有中间值 'before'=前收盘 ‘zero’ 0为中间值
      format: 'price'  // 输出数据的格式 rate, price, vol
    },
    right: {
      display: 'both', // none不显示，noupper不显示最上面, nofoot不显示最下面 = 显示坐标
      middle: 'before', // 是否有中间值 'before'=前收盘 ‘zero’ 0为中间值
      format: 'rate'   // rate, price vol
    }
  },
  lines: [{
    className: ClDrawLine,
    extremum:{ // 如何取极值
      method: 'fixedLeft', // fixedLeft fixedRight 上下固定,此时需要取axisY.middle的定义
      maxvalue: ['high'],  // 参与计算最大值的标签
      minvalue: ['low']    // 参与计算最小值的标签
    },
    info: {
      labelX: 'idx',
      labelY: 'close'
    }
  },
  {
    className: ClDrawLine,
    formula: {
      key: 'NOWM1',     // 获取数据的key，
      command: `out = this.AVGPRC()`  // 均价,要根据股票类型做变化
    }
  }]
};
export const CFG_CHART_NOWVOL = {
  title: {
    display: 'none', // none 不显示 btn 按钮 text 文字
  },
  axisX: {
    lines: 3,
    display: 'both', // 左右两边显示
    type: 'day1', // 有 day1 day5 和 normal 三种模式
    format: 'tradetime',
    width: 50 // 显示宽度，web下
  },
  axisY: {
    lines: 1,
    left: {
      display: 'nofoot',
      middle: 'none',
      format: 'vol'
    },
    right: {
      display: 'nofoot',
      middle: 'none',
      format: 'vol'
    }
  },
  lines: [{
    className: ClDrawVLine,
    extremum:{ // 如何取极值
      method: 'fixedLeft', // fixedLeft fixedRight 上下固定,此时需要取axisY.middle的定义
      maxvalue: ['decvol'],  // 参与计算最大值的标签
      minvalue: [0]    // 参与计算最小值的标签
    },
    info: {
      labelX: 'idx',
      labelY: 'decvol',
      color: 'vol'
    }
  }]
};

export const CFG_CHART_DAY5 = {
  title: {
    display: 'none', // none 不显示 btn 按钮 text 文字
  },
  axisX: {
    lines: 4,
    display: 'none', // none不显示，both 边各一个值, block：根据块大小每个块显示一个值 = 显示坐标
    type: 'day5', // 有 day1 day5 和 normal 三种模式
    format: 'date', // date time datetime normal tradetime：根据交易时间此时label无用 = 显示的信息方式
    width: 50       // 显示宽度，web下
  },
  axisY: {
    lines: 3,
    left: {
      display: 'both', // none不显示，all, noupper不显示最上面, nofoot不显示最下面 = 显示坐标
      middle: 'before',
      format: 'price'  // 输出数据的格式 rate, price, vol
    },
    right: {
      display: 'both', // none不显示，noupper不显示最上面, nofoot不显示最下面 = 显示坐标
      middle: 'before',
      format: 'rate'  // rate, price vol
    }
  },
  lines: [{
    className: ClDrawLine,
    extremum:{ // 如何取极值
      method: 'fixedLeft', // fixedLeft fixedRight 上下固定,此时需要取axisY.middle的定义
      maxvalue: ['decvol'],  // 参与计算最大值的标签
      minvalue: ['close']    // 参与计算最小值的标签
    },
    info: {
      labelX: 'time',
      labelY: 'close'
    }
  },
  {
    className: ClDrawLine,
    formula: {
      key: 'NOWDAY5',     // 获取数据的key，
      command: `out = this.AVGPRC()`  // 均价,要根据股票类型做变化
    }
  }]
};

export const CFG_CHART_DAY5VOL = {
  title: {
    display: 'none', // none 不显示 btn 按钮 text 文字
  },
  axisX: {
    lines: 4,
    display: 'block',
    type: 'day5', // 有 day1 day5 和 normal 三种模式
    format: 'date',  // date time datetime normal 显示的x轴信息方式
    width: 50 // 显示宽度，web下
  },
  axisY: {
    lines: 3,
    left: {
      display: 'both', // none不显示，all, noupper不显示最上面, nofoot不显示最下面 = 显示坐标
      middle: 'none',
      format: 'vol'  // 输出数据的格式 rate, price, vol
    },
    right: {
      display: 'both', // none不显示，noupper不显示最上面, nofoot不显示最下面 = 显示坐标
      middle: 'none',
      format: 'vol'   // rate, price vol
    }
  },
  lines: [{
    className: ClDrawVLine,
    extremum:{ // 如何取极值
      method: 'fixedLeft', // fixedLeft fixedRight 上下固定,此时需要取axisY.middle的定义
      maxvalue: ['vol'],  // 参与计算最大值的标签
      minvalue: [0]    // 参与计算最小值的标签
    },
    info: {
      labelX: 'time',
      labelY: 'vol',
      color: 'vol'
    }
  }]
};

export const CFG_CHART_NORMAL = {
  title: {
    display: 'text', // none 不显示 btn 按钮 text 文字
    label: 'NORMAL'
  },
  axisX: {
    lines: 0,
    display: 'none',
    type: 'normal', // 有 day1 day5 和 normal 三种模式
    format: 'date',  // date time datetime normal 显示的x轴信息方式
    width: 50
  },
  axisY: {
    lines: 1,
    left: {
      display: 'both',
      middle: 'none',
      format: 'price'
    },
    right: {
      display: 'both',
      middle: 'none',
      format: 'price'
    }
  },
  lines: [{
    className: ClDrawLine,
  }]
};
// ///////////////////////////
//  下面是一个接口API函数
// ///////////////////////////

export function setColor(syscolor, standard) {
  let color = {};
  if (syscolor === 'white') {
    color = copyJsonOfDeep(COLOR_WHITE);
  } else {
    color = copyJsonOfDeep(COLOR_BLACK);
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

  layout.text.pixel *= scale;
  layout.text.height *= scale;
  layout.text.spaceX *= scale;

  if (layout.text.height < (layout.text.pixel + 2 * scale)) {
    layout.text.height = layout.text.pixel + 2 * scale;
  }

  layout.digit.pixel *= scale;
  layout.digit.height *= scale;
  layout.digit.spaceX *= scale;

  if (layout.digit.height < (layout.digit.pixel + 2 * scale)) {
    layout.digit.height = layout.digit.pixel + 2 * scale;
  }

  layout.symbol.pixel *= scale;
  layout.symbol.size *= scale;
  layout.symbol.spaceX *= scale;

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

export function createSingleChart(cfg) {
  _initSystem(cfg);
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