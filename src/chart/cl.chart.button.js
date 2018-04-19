'use strict'

// ////////////////////////////////////////////////////////////////
//   按钮定义
// ▲▼※★☆○●◎☉√↑←→↓↖↗↘↙‰℃∧∨△□▽♂♀﹡
// ///////////////////////////////////////////////////////////////
import {
  _drawRect,
  _drawVline,
  _drawHline,
  _drawCircle,
  _setLineWidth,
  _drawTxt,
  _fillRect,
  _drawBegin,
  _drawSignCircle,
  _drawSignPlot,
  _setTransColor,
  _drawEnd
} from '../util/cl.draw'
import {
  initCommonInfo,
  checkLayout
} from '../chart/cl.chart.init'
import { CHART_LAYOUT } from '../cl.chart.def'
import { updateJsonOfDeep } from '../util/cl.tool'

export default function ClChartButton (father) {
  const DEFAULT_BUTTON = {
    shape: 'arc', // box range radio checkbox set(位置)
    hotIdx: 0,
    visible: true,
    translucent: true, // 是否透明
    status: 'enabled' // disable focused : 热点
  }
  initCommonInfo(this, father)
  // ////////////////////////////////////////////////////////////////
  //   程序入口程序，以下都是属于设置类函数，基本不需要修改，
  // ///////////////////////////////////////////////////////////////
  this.init = function (cfg, callback) {
    this.callback = callback
    this.rectMain = cfg.rectMain || {
      left: 0,
      top: 0,
      width: 25,
      height: 25
    }
    this.layout = updateJsonOfDeep(cfg.layout, CHART_LAYOUT)
    this.config = updateJsonOfDeep(cfg.config, DEFAULT_BUTTON)

    this.info = cfg.info || [{
      map: '+'
    }]
    // map: 如果不在以下 '+' '-' 'left' 'right'就表示直接显示字符串

    // 下面对配置做一定的校验
    this.checkConfig()
  }
  this.checkConfig = function () { // 检查配置有冲突的修正过来
    checkLayout(this.layout)
  }
  this.setStatus = function (status) {
    if (this.config.status !== status) {
      this.config.status = status
    }
  }
  // ////////////////////////////////////////////////////////////////
  //   绘图函数
  // ///////////////////////////////////////////////////////////////
  this.onClick = function (event) {
    if (!this.config.visible) return
    // if (this.config.status === 'disabled') return
    if (this.info.length > 1) {
      this.config.hotIdx++
      this.config.hotIdx %= this.info.length
      this.onPaint()
    }
    if (this.config.hotIdx >= 0 && this.config.hotIdx < this.info.length) {
      this.callback({
        self: this,
        info: this.info[this.config.hotIdx]
      })
    } else {
      this.callback({
        self: this
      })
    }
    event.break = true
  }
  // 事件监听
  this.onPaint = function () { // 重画
    if (!this.config.visible) return
    _setLineWidth(this.context, this.scale)

    let clr = this.color.button
    if (this.config.status === 'disabled') clr = this.color.grid

    _drawBegin(this.context, clr)
    const center = {
      xx: Math.floor(this.rectMain.width / 2),
      yy: Math.floor(this.rectMain.height / 2),
      offset: 4 * this.scale
    }

    const info = this.info[this.config.hotIdx]
    switch (this.config.shape) {
      case 'set':
        if (this.config.status === 'focused') {
          clr = this.color.red
          if (this.config.translucent) clr = _setTransColor(clr, 0.95)
          _drawSignPlot(this.context, this.rectMain.left + center.xx,
            this.rectMain.top + center.xx, {
              r: Math.round(this.layout.symbol.size / 2),
              clr
            }
          )
          center.yy = center.xx
        } else {
          clr = this.color.vol
          if (this.config.translucent) clr = _setTransColor(clr, 0.85)
          _drawSignCircle(this.context, this.rectMain.left + center.xx, this.rectMain.top + center.xx, {
            r: Math.round(this.layout.symbol.size / 2),
            clr
          })
        }
        break
      case 'arc':
        _drawCircle(this.context, this.rectMain.left + center.xx, this.rectMain.top + center.xx, center.xx)
        break
      case 'box':
        _fillRect(this.context, this.rectMain.left, this.rectMain.top, this.rectMain.width, this.rectMain.height, this.color.back)
        _drawRect(this.context, this.rectMain.left, this.rectMain.top, this.rectMain.width, this.rectMain.height)
        break
      case 'range':
        _drawCircle(this.context, this.rectMain.left + center.xx, this.rectMain.top + center.xx, center.xx)
        break
      case 'radio':
        _drawCircle(this.context, this.rectMain.left + center.xx, this.rectMain.top + center.xx, center.xx)
        break
      case 'checkbox':
        _drawCircle(this.context, this.rectMain.left + center.xx, this.rectMain.top + center.xx, center.xx)
        break
      default:
    }
    _drawEnd(this.context)
    if (this.config.status === 'disabled') _drawBegin(this.context, this.color.grid)
    else _drawBegin(this.context, this.color.button)
    switch (info.map) {
      case '+':
        _drawVline(this.context, this.rectMain.left + center.xx, this.rectMain.top + center.offset,
          this.rectMain.top + this.rectMain.height - center.offset)
        _drawHline(this.context, this.rectMain.left + center.offset,
          this.rectMain.left + this.rectMain.width - center.offset, this.rectMain.top + center.yy)
        break
      case '-':
        _drawHline(this.context, this.rectMain.left + center.offset,
          this.rectMain.left + this.rectMain.width - center.offset, this.rectMain.top + center.yy)
        break
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        _drawTxt(this.context, this.rectMain.left + center.xx, this.rectMain.top + center.yy, info.map,
          this.layout.title.font, this.layout.title.pixel, this.color.baktxt, {
            x: 'center',
            y: 'middle'
          })
        break
      case '*':
        _drawTxt(this.context, this.rectMain.left + center.xx, this.rectMain.top + center.yy - 2 * this.scale, '...',
          this.layout.title.font, this.layout.title.pixel, this.color.baktxt, {
            x: 'center',
            y: 'middle'
          })
        break
      case 'left':
      case 'right':
        break
      default:
        _drawTxt(this.context, this.rectMain.left + center.xx, this.rectMain.top + center.yy, info.map,
          this.layout.title.font, this.layout.title.pixel, this.color.button, {
            x: 'center',
            y: 'middle'
          })
        break
    }
    _drawEnd(this.context)
  }
}
