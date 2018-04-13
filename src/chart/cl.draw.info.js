'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineKBar 的实体定义
// //////////////////////////////////////////////////

import {
  _fillRect,
  _getTxtWidth,
  _drawTxt
} from '../util/cl.draw';
import {
  initCommonInfo
} from '../cl.chart';

// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawInfo(father, rectMain, rectMess) {
  initCommonInfo(this, father);
  this.rectMain = rectMain;
  this.rectMess = rectMess;

  this.linkinfo = father.father.linkinfo;

  this.text = father.layout.text;
  this.title = father.config.title;

  this.onPaint = function (message) {
    if (this.title.display === 'none' || this.linkinfo.hideInfo) return;

    _fillRect(this.context, this.rectMain.left + this.scale, this.rectMain.top + this.scale,
      this.rectMain.width - 2 * this.scale, this.rectMain.height - 2 * this.scale, this.color.back);

    let clr = this.color.txt;
    const spaceY = Math.round((this.text.height - this.text.pixel) / 2) - this.scale;
    const yy = this.rectMess.top + spaceY;

    _drawTxt(this.context, this.rectMain.left + this.scale, yy, this.title.label,
      this.text.font, this.text.pixel, clr);

    let xx = this.rectMess.left + this.scale;
    for (let i = 0; i < message.length; i++) {
      clr = this.color.line[i];
      _drawTxt(this.context, xx, yy, message[i].txt, this.text.font, this.text.pixel, clr);
      xx += _getTxtWidth(this.context, message[i].txt, this.text.font, this.text.pixel) + this.text.spaceX;
      if (message[i].value === undefined) continue;
      _drawTxt(this.context, xx, yy, ' ' + message[i].value, this.text.font, this.text.pixel, clr);
      xx += _getTxtWidth(this.context, ' ' + message[i].value, this.text.font, this.text.pixel) + this.text.spaceX;
    }
  }
}
