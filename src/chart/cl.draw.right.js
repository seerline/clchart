'use strict'

// //////////////////////////////////////////////////
// 以下是 ClLineRight 的实体定义
// //////////////////////////////////////////////////

import {
  _getTxtWidth,
  _drawTxt
} from '../util/cl.draw';
import {
  findNearTimeToIndex
} from './cl.chart.tools';
import getValue from '../data/cl.data.tools';
import {
  initCommonInfo
} from '../cl.chart';
// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawRight(father, rectMain) {
  initCommonInfo(this, father);
  this.rectMain = rectMain;

  this.linkInfo = father.father.linkInfo;
  this.source = father.father;
  this.symbol = father.layout.symbol;

  this.onPaint = function(key) {
    this.data = this.source.getData(key);
    this.rightData = this.source.getData('RIGHT');

    const len = _getTxtWidth(this.context, '▲', this.symbol.font, this.symbol.pixel);
    for (let i = 0; i < this.rightData.value.length; i++) {
      const idx = findNearTimeToIndex(this.data, getValue(this.rightData, 'time', i));
      const offset = idx - this.linkInfo.minIndex;
      const xx = this.rectMain.left + offset * (this.linkInfo.unitX + this.linkInfo.spaceX) + Math.floor(this.linkInfo.unitX / 2);
      if (xx < this.rectMain.left) {
        continue;
      }
      let clr = this.color.button;
      if (this.linkInfo.rightMode !== 'no') clr = this.color.vol;
      _drawTxt(this.context, xx - Math.floor(len / 2), this.rectMain.top,
          '▲', this.symbol.font, this.symbol.pixel, clr, { y: 'top' });
    }
  };
}
