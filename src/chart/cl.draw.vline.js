'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineKBar 的实体定义
// //////////////////////////////////////////////////

import {
  _drawBegin,
  _drawEnd,
  _drawLineAlone,
  _drawmoveTo,
  _drawlineTo
} from '../util/cl.draw';
import getValue from '../data/cl.data.tools';
import {
  initCommonInfo
} from '../cl.chart';

export default function ClDrawVLine(father, rectMain) {
  initCommonInfo(this, father);
  this.rectMain = rectMain;

  this.linkInfo = father.father.linkInfo;
  this.source = father.father;

  this.maxmin = father.maxmin;

  this.onPaint = function (key) {
    this.data = this.source.getData(key);

    let clr;
    if (this.out.labelX === undefined) this.out.labelX = 'time';
    if (this.out.labelY === undefined) this.out.labelY = 'vol';
    if (this.out.color === undefined) clr = this.color.line[0];
    else clr = this.color[this.out.color];

    let index;
    let xx, yy, value;

    _drawBegin(this.context, clr);
    for (let k = this.linkInfo.minIndex; k <= this.linkInfo.maxIndex; k++) {
      index = getValue(this.data, this.out.labelX, k);
      if (index < 0) continue;
      xx = this.rectMain.left + Math.floor(index * (this.linkInfo.spaceX + this.linkInfo.unitX));
      value = getValue(this.data, this.out.labelY, k);
      if (value < 0) continue;
      yy = this.rectMain.top + Math.round((this.maxmin.max - value) * this.maxmin.unitY);
      if (yy < this.rectMain.top) {
        yy = this.rectMain.top + 1;
        _drawLineAlone(this.context, xx, this.rectMain.top + this.rectMain.height - 1, xx, yy, this.color.white);
        continue;
      }
      _drawmoveTo(this.context, xx, this.rectMain.top + this.rectMain.height - 1);
      _drawlineTo(this.context, xx, yy);
    }
    _drawEnd(this.context);
  };
}


