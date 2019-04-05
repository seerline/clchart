/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CHART_SEER } from './cl.seer.def'
// import ClDrawSeer from './cl.seer'
import ClDrawSeer, { FIELD_SEER } from './cl.seer'
import ClChartSuper from './cl.super'

export default {
  CHART_SEER,
  FIELD_SEER
}

// 为了避免重名，以作者的名字为命名空间，方便检索
export const _globalUserClassDefine = {
  // this is user register class
  'coollyer' : {
    'seer' : ClDrawSeer,
    'super' : ClChartSuper
  }
};
