'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineKBar 的实体定义
// //////////////////////////////////////////////////

import {
  _drawBegin,
  _drawEnd,
  _drawKBar
} from '../util/cl.draw';
import getValue from '../data/cl.data.tools';
import {
  initCommonInfo
} from '../cl.chart';

// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawKBar(father, rectMain) {
  initCommonInfo(this, father);
  this.rectMain = rectMain;

  this.linkInfo = father.father.linkInfo;
  this.source = father.father;
  this.maxmin = father.maxmin;

  this.onPaint = function (key) {
    this.data = this.source.getData(key);

    let clr = this.color.red;
    _drawBegin(this.context, clr);
    let open, close, before;
    for (let k = 0, idx = this.linkInfo.minIndex; idx <= this.linkInfo.maxIndex; k++, idx++) {
      if (idx > 0) before = getValue(this.data, 'close', idx - 1);
      open = getValue(this.data, 'open', idx);
      close = getValue(this.data, 'close', idx);
      if (open < close || (open === close && close >= before)) {
        _drawKBar(this.context, {
          filled: false,
          index: k,
          spaceX: this.linkInfo.unitX,
          unitX: this.linkInfo.spaceX,
          unitY: this.maxmin.unitY,
          maxmin: this.maxmin,
          rect: this.rectMain,
          fillclr: clr
        },
          [close,
            getValue(this.data, 'high', idx),
            getValue(this.data, 'low', idx),
            open
          ]);
      }
    }
    _drawEnd(this.context);
    clr = this.color.green;
    _drawBegin(this.context, clr);
    for (let k = 0, idx = this.linkInfo.minIndex; idx <= this.linkInfo.maxIndex; k++, idx++) {
      if (idx > 0) before = getValue(this.data, 'close', idx - 1);
      open = getValue(this.data, 'open', idx);
      close = getValue(this.data, 'close', idx);
      if (open > close || (open === close && close < before)) {
        _drawKBar(this.context, {
          filled: true,
          index: k,
          spaceX: this.linkInfo.unitX,
          unitX: this.linkInfo.spaceX,
          unitY: this.maxmin.unitY,
          maxmin: this.maxmin,
          rect: this.rectMain,
          fillclr: clr
        },
          [open,
            getValue(this.data, 'high', idx),
            getValue(this.data, 'low', idx),
            close
          ]);
      }
    }
    _drawEnd(this.context);
  };
}
