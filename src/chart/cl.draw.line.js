'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineKBar 的实体定义
// //////////////////////////////////////////////////

import {
  _drawBegin,
  _drawEnd,
  _drawmoveTo,
  _drawlineTo
} from '../util/cl.draw';
import getValue from '../data/cl.data.tools';
import { initCommonInfo } from '../cl.chart';
import {
  inRect
} from '../util/cl.tool';

export default function ClDrawLine(father, rectMain) {
  initCommonInfo(this, father);
  this.rectMain = rectMain;

  this.linkInfo = father.father.linkInfo;

  this.maxmin = father.maxmin;

  this.onPaint = function (key) {
    this.data = this.source.getData(key);

    let clr;
    if (this.out.labelX === undefined) this.out.labelX = 'idx';
    if (this.out.labelY === undefined) this.out.labelY = 'value';
    if (this.out.color === undefined) clr = this.color.line[0];
    else clr = this.color[this.out.color];
    // 分钟线为‘close’

    let xx, yy;
    let index;
    let isBegin = false;

    _drawBegin(this.context, clr);
    for (let k = this.linkInfo.minIndex; k <= this.linkInfo.maxIndex; k++) {
      index = getValue(this.data, this.out.labelX, k);
      if (index < 0) continue;
      xx = this.rectMain.left + index * (this.linkInfo.unitX + this.linkInfo.spaceX);
      yy = this.rectMain.top + Math.round((this.maxmin.max - getValue(this.data, this.out.labelX, k)) * this.maxmin.unitY);
      if (!isBegin) {
        isBegin = inRect(this.rectChart, { x: xx, y: yy });
        if (isBegin) _drawmoveTo(this.context, xx, yy);
        continue;
      }
      _drawlineTo(this.context, xx, yy);
    }
    _drawEnd(this.context);
  };
}
