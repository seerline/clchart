/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// 以下是 ClDrawSeer 的实体定义

// case 1: return '未生效';
// case 2: return '股票停牌';
// case 20: return '股东增持';
// case 100: return '已生效(1 -> 100)';
// case 101: return '已成功(100 -> 101)';
// case 102: return '已失败(100 -> 102)';
// case 200: return '未成功已结束(100 -> 200)';
// case 201: return '成功已结束(101 -> 201)';
// case 202: return '失败已结束(102 -> 202)';
// case 300: return '未生效已结束(1/2 -> 300)';
// case 400: return '错误';
// 预定义参数

import ClDrawKBar from '../chart/cl.draw.kbar'
import ClDrawRight from '../chart/cl.draw.right'
import ClDrawSeer from './cl.seer'

/** @module SeerConfig */

export const CHART_SEER = {
  zoomInfo: {
    index: 3,
    list: [1, 2, 4, 5, 7, 9, 12, 15, 19]
  },
  // zoomInfo: {
  //   min: 1,
  //   max: 26,
  //   index: 2, // value = index*index + 1 [1,2,5,10,17,26]
  //   value: 7 // 实际的值，如果超过10，就会index=3，如果为4，index=1 index = sqrt（value - 1）
  // },
  scroll: {
    display: 'none' // none不显示
  },
  title: {
    display: 'none' // none 不显示 btn 按钮 text 文字
  },
  axisX: {
    lines: 0,
    display: 'both', // none不显示， both 两边各一个值, block ：根据lines每个块显示一个值 = 显示坐标
    type: 'normal', // 有 day1 当日 day5 5日线 和 normal:日线 三种模式
    format: 'date' // date time datetime normal tradetime(9:30) 根据交易时间此时 = 输出的信息格式    width: 50       // 显示宽度，web下
  },
  axisY: {
    lines: 3,
    left: {
      display: 'both', // none不显示, both, noupper 不显示最上面, nofoot不显示最下面 = 显示坐标
      middle: 'none', // 是否有中间值 'before'=前收盘 ‘zero’ 0为中间值
      format: 'price' // 输出数据的格式 rate, price 保留一定小数位 vol 没有小数
    },
    right: {
      display: 'both', // none不显示，noupper 不显示最上面, nofoot不显示最下面 = 显示坐标
      middle: 'none', // 是否有中间值 'before'=前收盘 ‘zero’ 0为中间值
      format: 'price' // rate, price vol
    }
  },
  lines: [{
    // type: 'l_kbar',
    className: ClDrawKBar,
    extremum: { // 如何取极值
      method: 'normal', // fixedLeft fixedRight 上下固定,此时需要取axisY.middle的定义
      maxvalue: ['high'], // 参与计算最大值的标签
      minvalue: ['low'] // 参与计算最小值的标签
    }
    // 第一根线默认的key是跟随chart的hotKey变化而变化的，其他线要么自己有数据，要么根据hotKey加上公式计算出自己的key
  },
  {
    className: ClDrawRight
  },
  {
    className: ClDrawSeer
  }]
}
