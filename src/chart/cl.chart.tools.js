/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import getValue from '../data/cl.data.tools'

// ///////////////////////////////////////
// 和定位相关基本函数
// //////////////////////////////////////

/** @module ChartTools */

/**
 * According to the label in the data to find a matching record number
 * @export
 * @param {Object} data
 * @param {Number} findvalue
 * @param {String} label
 * @return {Number}
 */
export function findLabelToIndex (data, findvalue, label) {
  for (let idx = 0; idx <= data.value.length - 1; idx++) {
    if (findvalue === getValue(data, label, idx)) {
      return idx
    }
  }
  return -1
}
// 查找最匹配time的记录号，direction为forword的时候表示从后面向前开始寻找，
/**
 * Find the record number that matches the time. When the direction is forword, it means to start looking from behind.
 * @export
 * @param {Object} data
 * @param {Number} findvalue
 * @param {String} label
 * @param {String} direction
 * @return {Number}
 */
export function findNearTimeToIndex (data, findvalue, label, direction) {
  if (label === undefined) label = 'time'
  if (direction && direction === 'forword') {
    for (let idx = data.value.length - 1; idx >= 0; idx--) {
      if (getValue(data, label, idx) > findvalue) continue
      return idx
    }
  } else {
    for (let idx = 0; idx <= data.value.length - 1; idx++) {
      if (getValue(data, label, idx) < findvalue) continue
      return idx
    }
  }
  return -1
}
/**
 * Specifically dealing with the time-sharing map and the 5-day map all this data will be smaller than the interface, in this case elementW is generally only one pixel
 * @export
 * @param {Object} info
 * @param {Object} config
 */
export function setFixedLineFlags (info, config) {
  info.showMode = 'fixed'
  info.fixed = {
    min: 0,
    max: config.maxCount - 1,
    left: 0,
    right: 0
  }
  info.minIndex = 0
  info.maxIndex = config.size - 1
  // 5日线时 spaceX初始值设为0
  info.maxCount = config.maxCount > 1 ? config.maxCount : 2
  info.unitX = config.scale
  info.spaceX = config.width / info.maxCount - info.unitX
}
/**
 * In this case spaceX requires a minimum of one pixel
 * @export
 * @param {Object} info
 * @param {Object} config
 */
export function setMoveLineFlags (info, config) {
  const spaceX = info.unitX / 4
  info.spaceX = spaceX < config.scale ? config.scale : spaceX
  info.maxCount = Math.floor(config.width / (info.unitX + info.spaceX)) // 整个图形区域最大显示记录数
  const offset = info.maxCount > config.size ? config.size : info.maxCount

  switch (info.showMode) {
    case 'fixed':
    // 要根据fixed的最大最小值，合并数据
      info.maxIndex = config.size - 1
      info.minIndex = config.size - offset
      break
    case 'locked':
      // info.locked.index = config.index ? config.index : info.locked.index;
      // 把需要锁定的记录初始化，如果没有值就取当前画面中间的值
      // info.locked.set = config.set ? config.set : info.locked.set;
      break
    case 'move':
      break
    default: // case 'last':
      info.maxIndex = config.size - 1
      info.minIndex = config.size - offset
      break
  }
}
