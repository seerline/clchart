'use strict'

// //////////////////////////////////////////////////
// 以下是 ClDrawCursor 的实体定义
// //////////////////////////////////////////////////

import {
  _getTxtWidth,
  _drawTxtRect,
  _drawLineAlone
} from '../util/cl.draw';
import {
  initCommonInfo
} from '../cl.chart';
import {
  inRangeX,
  inRangeY,
  formatShowTime,
  formatInfo
} from '../util/cl.tool';
// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawCursor(father, rectMain, rectChart) {
  initCommonInfo(this, father);
  this.rectMain = rectMain;  // 画十字线和边界标签
  this.rectChart = rectChart; // 鼠标有效区域

  this.static = father.father.static;
  this.linkInfo = father.father.linkInfo;

  this.axisX = father.config.axisX;
  this.axisY = father.config.axisY;

  this.maxmin = father.maxmin;
  this.text = father.layout.text;

  this.onPaint = function (mousePos, valueX, valueY) {
    // console.log(mousePos, this.rectChart);
    if (inRangeX(this.rectChart, mousePos.x) === false) return;

    let txt;
    let xx = mousePos.x
    let yy = mousePos.y;
    let th = this.text.pixel + 2 * this.scale;
    const offX = this.axisPlatform === 'phone' ? 2 * this.scale : -2 * this.scale;

    // 如果鼠标在本图区域，就画横线信息
    if (inRangeY(this.rectChart, mousePos.y)) {
      if (valueY === undefined) {
        valueY = this.maxmin.max - (mousePos.y - this.rectChart.top) / this.maxmin.unitY;
      } else {
        yy = (this.maxmin.max - valueY) * this.maxmin.unitY + this.rectChart.top;
      }
      // console.log(mousePos, valueY );

      _drawLineAlone(this.context, this.rectMain.left, yy, this.rectMain.left + this.rectMain.width, yy, this.color.grid)
      let posX = this.axisPlatform === 'phone' ? 'start' : 'end';

      if (this.axisY.left.display !== 'none') {
        txt = formatInfo(
          valueY,
          this.axisY.left.format,
          this.static.decimal,
          this.static.before);
        xx = this.rectMain.left + offX;
        _drawTxtRect(this.context, xx, yy, txt, {
          font: this.text.font,
          pixel: this.text.pixel,
          clr: this.color.txt,
          bakclr: this.color.grid,
          x: posX,
          y: 'middle'
        });
      }
      if (this.axisY.right.display !== 'none') {
        txt = formatInfo(
          valueY,
          this.axisY.right.format,
          this.static.decimal,
          this.static.before);
        posX = this.axisPlatform === 'phone' ? 'end' : 'start';
        xx = this.rectMain.left + this.rectMain.width - offX;
        _drawTxtRect(this.context, xx, yy, txt, {
          font: this.text.font,
          pixel: this.text.pixel,
          clr: this.color.txt,
          bakclr: this.color.grid,
          x: posX,
          y: 'middle'
        })
      }
    }

    _drawLineAlone(this.context, mousePos.x, this.rectMain.top, mousePos.x, this.rectMain.top + this.rectMain.height - 1, this.color.grid)
    if (this.axisX.display !== 'none') {
      xx = mousePos.x;
      th = Math.floor((this.text.height - this.text.pixel) / 2);
      yy = this.rectMain.top + this.rectMain.height + th;
      txt = formatShowTime(this.father.data.key, valueX);
      const len = Math.round(_getTxtWidth(this.context, txt, this.text.font, this.text.pixel) / 2);
      let posX = 'center';
      if (xx - len < this.rectMain.left + offX) { xx = this.rectMain.left + offX; posX = 'start'; }
      if (xx + len > this.rectMain.left + this.rectMain.width - offX) {
        xx = this.rectMain.left + this.rectMain.width - offX;
        posX = 'end';
      }
      _drawTxtRect(this.context, xx, yy, txt, {
        font: this.text.font,
        pixel: this.text.pixel,
        clr: this.color.txt,
        bakclr: this.color.grid,
        x: posX,
        y: 'top'
      })
    }
  }
}