'use strict'

// //////////////////////////////////////////////////
// 以下是 ClDrawSeer 的实体定义
// //////////////////////////////////////////////////
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

import {
  _drawSignCircle,
  _drawSignHLine,
  _drawSignVLine
} from '../util/cl.draw';
import {
  findNearTimeToIndex
} from './cl.chart.tools';
import getValue from '../data/cl.data.tools';
import {
  initCommonInfo
} from '../cl.chart';
import {
  inArray,
  inRangeY,
  intersectArray,
  formatPrice
} from '../util/cl.tool';

// 创建时必须带入父类，后面的运算定位都会基于父节点进行；
// 这个类仅仅是画图, 因此需要把可以控制的rect传入进来
export default function ClDrawSeer(father, rectMain) {
  initCommonInfo(this, father);
  this.rectMain = rectMain;

  this.linkInfo = father.father.linkInfo;
  this.source = father.father;

  this.static = father.father.static;

  this.maxmin = father.maxmin;
  this.text = father.layout.text;

  this.getSeerPos = function (index, nowprice) {
    const offset = index - this.linkInfo.minIndex;
    if (offset < 0 || index > this.linkInfo.maxIndex) {
      return {
        finded: false
      }
    }
    // 不在视线内就不画

    const xx = this.rectMain.left + offset * (this.linkInfo.unitX + this.linkInfo.spaceX) + Math.floor(this.linkInfo.unitX / 2);
    let price = nowprice;
    if (nowprice === undefined) {
      price = getValue(this.data, 'close', index);
    }
    const yy = this.rectMain.top + Math.round((this.maxmin.max - price) * this.maxmin.unitY);
    return {
      finded: true,
      xx,
      yy
    };
  }

  this.drawHotSeer = function (no) {
    let idx = findNearTimeToIndex(this.data, getValue(this.seerList, 'start', no), 'forword');
    if (idx === -1) idx = this.linkInfo.maxIndex;
    const offset = idx - this.linkInfo.minIndex;
    if (offset < 0) return; // 不在视线内就不画

    const xx = this.rectMain.left + offset * (this.linkInfo.unitX + this.linkInfo.spaceX) + Math.floor(this.linkInfo.unitX / 2);

    const status = getValue(this.seerList, 'status', no);
    const start_price = getValue(this.seerList, 'buy', no);
    let price = start_price;
    let yy = this.rectMain.top + Math.round((this.maxmin.max - price) * this.maxmin.unitY);

    let start_txt = this.linkInfo.hideInfo ? '买点' : '买点:' + formatPrice(price, this.static.decimal);
    if (start_price === 0) {
      start_txt = '停牌中'; // 停牌期间预测的股票
      price = getValue(this.data, 'close', idx);
      yy = this.rectMain.top + Math.round((this.maxmin.max - price) * this.maxmin.unitY);
    }
    let color = this.color.vol;
    if (inArray(status, [1, 20, 300])) {
      color = this.color.txt;
    } else if (inArray(status, [2])) {
      start_txt = '停牌中';
    }
    _drawSignHLine(this.context, {
      linew: this.scale,
      xx,
      yy,
      right: this.rectMain.left + this.rectMain.width - 2 * this.scale,
      clr: color,
      bakclr: this.color.back,
      font: this.title.font,
      pixel: this.title.pixel,
      spaceX: 4 * this.scale,
      spaceY: 3 * this.scale,
      x: 'start',
      y: 'middle'
    }, [{
      txt: start_txt,
      set: 100,
      display: !this.linkInfo.hideInfo
    }]);

    let txt = ' 周期:[' + getValue(this.seerList, 'period', no) + '天]';
    if (getValue(this.seerList, 'surplus', no) > 0) txt += ' 剩余:[' + getValue(this.seerList, 'surplus', no) + '天]';

    _drawSignVLine(this.context, {
      linew: this.scale,
      xx,
      yy,
      left: this.rectMain.left,
      bottom: this.rectMain.top + this.rectMain.height,
      clr: color,
      bakclr: this.color.back,
      font: this.title.font,
      pixel: this.title.pixel,
      spaceX: 2 * this.scale,
      paceY: 2 * this.scale
    }, [{
      txt: 'arc',
      set: 0,
      minR: 0,
      maxR: 3 * this.scale,
      display: true
    },
    {
      txt: getValue(this.seerList, 'start', no) + txt,
      set: 100,
      display: true
    }
    ]);

    if (start_price === 0) return;
    // ///////////////////////////////
    let infos;
    price = getValue(this.seerList, 'stoploss', no);
    let yl = this.rectMain.top + Math.round((this.maxmin.max - price) * this.maxmin.unitY);
    if (yl - yy > 1.5 * this.title.pixel) {
      infos = [{
        txt: 'arc',
        set: 0,
        minR: 0,
        maxR: 2 * this.scale,
        display: true
      },
      {
        txt: this.linkInfo.hideInfo ? '止损' : '止损:' + formatPrice(price, this.static.decimal),
        set: 100,
        display: !this.linkInfo.hideInfo
      }
      ];
    } else {
      infos = [{
        txt: 'arc',
        set: 0,
        minR: 0,
        maxR: 2 * this.scale,
        display: true
      },
      {
        txt: 'arc',
        set: 100,
        minR: 0,
        maxR: 1 * this.scale,
        display: true
      }
      ];
    }
    if (inRangeY(this.rectMain, yy)) {
      _drawSignHLine(this.context, {
        linew: this.scale,
        xx,
        yy: yl,
        right: this.rectMain.left + this.rectMain.width - 2 * this.scale,
        clr: this.color.green,
        bakclr: this.color.back,
        font: this.title.font,
        pixel: this.title.pixel,
        spaceX: 4 * this.scale,
        spaceY: 3 * this.scale,
        x: 'start',
        y: 'middle'
      }, infos);
    }

    price = getValue(this.seerList, 'target', no);
    yl = this.rectMain.top + Math.round((this.maxmin.max - price) * this.maxmin.unitY);
    if (yy - yl > 1.5 * this.title.pixel) {
      infos = [{
        txt: 'arc',
        set: 0,
        minR: 0,
        maxR: 2 * this.scale,
        display: true
      },
      {
        txt: this.linkInfo.hideInfo ? '目标' : '目标:' + formatPrice(price, this.static.decimal),
        set: 100,
        display: !this.linkInfo.hideInfo
      }
      ];
    } else {
      infos = [{
        txt: 'arc',
        set: 0,
        minR: 0,
        maxR: 2 * this.scale,
        display: true
      },
      {
        txt: 'arc',
        set: 100,
        minR: 0,
        maxR: 2 * this.scale,
        display: true
      }
      ];
    }
    if (inRangeY(this.rectMain, yy)) {
      _drawSignHLine(this.context, {
        linew: this.scale,
        xx,
        yy: yl,
        right: this.rectMain.left + this.rectMain.width + this.config.drawoffset.right - 2 * this.scale,
        clr: this.color.red,
        bakclr: this.color.back,
        font: this.title.font,
        pixel: this.title.pixel,
        spaceX: 4 * this.scale,
        spaceY: 3 * this.scale,
        x: 'start',
        y: 'middle'
      }, infos);
    }
    // ///////////显示预测结束的信息///////////////////
    const stop = getValue(this.seerList, 'stop', no);
    // 100 进行中
    if (inArray(status, [101, 102, 200, 201, 202, 300])) {
      const stopIdx = findNearTimeToIndex(this.data, stop, 'forword');
      const stopOffset = stopIdx - this.linkInfo.minIndex;
      const stopX = this.rectMain.left + stopOffset * (this.linkInfo.unitX + this.linkInfo.spaceX) + Math.floor(this.linkInfo.unitX / 2);
      if (stopX > this.rectMain.left && stopX < this.rectMain.left + this.rectMain.width - 4 * this.scale) {
        color = this.color.vol;
        price = getValue(this.seerList, 'buy', no);
        yl = this.rectMain.top + Math.round((this.maxmin.max - price) * this.maxmin.unitY);
        if (inArray(status, [102, 202])) {
          color = this.color.green;
          price = getValue(this.seerList, 'stoploss', no);
          yl = this.rectMain.top + Math.round((this.maxmin.max - price) * this.maxmin.unitY);
        } else if (inArray(status, [101, 201])) {
          color = this.color.red;
          price = getValue(this.seerList, 'target', no);
          yl = this.rectMain.top + Math.round((this.maxmin.max - price) * this.maxmin.unitY);
        } else if (inArray(status, [300])) {
          color = this.color.txt;
        }
        _drawSignCircle(this.context, stopX, yl, {
          r: 3 * this.scale,
          clr: color
        },
          // { r: 2 * this.scale, clr: this.color.back },
        );
      }
    }
  }

  this.filterSeer = function () {
    const out = {};
    for (let i = 0; i < this.seerList.value.length; i++) {
      if (getValue(this.seerList, 'code', i) !== getValue(this.stockInfo, 'code')) continue;

      const curDate = getValue(this.seerList, 'start', i);
      let index = findNearTimeToIndex(this.data, curDate, 'forword');
      if (index === -1) index = this.linkInfo.maxIndex;
      out[index].name = 'SEER' + index;
      out[index].nos.push(i);
      out[index].uids.push(getValue(this.seerList, 'uid', i));
      // 这里判断当前节点是否存在热点
      if (inArray(getValue(this.seerList, 'uid', i), this.seerHot.value)) {
        out[index].hot = true;
        out[index].hotIdx = i;
      }
    }
    return out;
  }
  this.onPaint = function (key) {
    this.data = this.source.getData(key);
    this.seerList = this.source.getData('SEER');
    this.seerHot = this.source.getData('SEERHOT');
    this.stockInfo = this.source.getData('INFO');

    if (this.seerList.value.length < 1) return 0;
    this.seerShow = this.filterSeer(); // name,date,[该按钮对应的id列表],chart按钮

    // 先画点，最后画激活的那个
    // 不在视线内不显示任何信息
    for (const k in this.seerShow) {
      let showPrice;
      if (this.seerShow[k].uids.length < 1) continue;
      // 如果只有一条记录就以买入价为定位，否则以收盘价为定位
      if (this.seerShow[k].uids.length === 1) {
        showPrice = getValue(this.seerList, 'buy', this.seerShow[k].nos[0]);
      }
      this.seerShow[k].chart = this.father.createButton(this.seerShow[k].name);
      if (this.seerShow[k].hot === true) {
        this.father.setHotButton(this.seerShow[k].chart);
        if (this.seerHot.value.length === 1) {
          showPrice = getValue(this.seerList, 'buy', this.seerShow[k].hotidx);
        }
      }
      // 设置可见
      const pos = this.getSeerPos(k, showPrice);
      if (!pos.finded) {
        this.seerShow[k].chart.visible = 'false';
        continue;
      } else {
        this.seerShow[k].chart.visible = 'true';
      }

      let num = '*';
      if (this.seerShow[k].uids.length < 10) {
        num = this.seerShow[k].uids.length.toString();
      }
      const arr = intersectArray(this.seerShow[k].uids, this.seerHot.value); // 表示是热点
      const acrR = 9;
      const nowStatus = arr.length > 0 ? 'focused' : 'enabled';

      this.seerShow[k].chart.init({
        rectMain: {
          left: pos.xx - acrR * this.scale,
          top: nowStatus === 'focused' ? pos.yy - acrR * this.scale - 2 * acrR * this.scale : pos.yy - acrR * this.scale,
          width: 2 * acrR * this.scale,
          height: nowStatus === 'focused' ? 2 * acrR * this.scale + 2 * acrR * this.scale : 2 * acrR * this.scale
        },
        config: {
          maxR: 3.5 * this.scale,
          pixel: 5.5 * this.scale,
          txtclr: this.color.back,
          backclr: this.color.sys,
          box: 'set'
        },
        info: [{
          map: num
        }],
        status: nowStatus
      },
        result => {
          const self = result.self.father;
          const arrhot = intersectArray(this.seerShow[k].uids, this.seerHot.value);
          if (arrhot.length > 0) {
            this.seerHot.value = [];
            self.callback({
              event: 'seerclick',
              data: []
            });
            this.onPaint();
          } else {
            this.seerHot.value = this.seerShow[k].uids;
            self.callback({
              event: 'seerclick',
              data: this.seerShow[k].uids
            });
            this.onPaint();
          }
        });
    }
    if (this.seerHot.value.length === 1) {
      for (let k = 0; k < this.seerList.value.length; k++) {
        if (getValue(this.seerList, 'uid', k) === this.seerHot.value[0]) {
          this.drawHotSeer(k);
        }
      }
    }
  }
}
