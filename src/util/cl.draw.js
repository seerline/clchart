/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** @module DrawUtils */

/**
 * get image data
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx
 * @param {Number} yy
 * @param {Number} ww
 * @param {Number} hh
 * @return {Object}
 */
export function _getImageData (context, xx, yy, ww, hh) {
  if (context.getImageData) {
    return context.getImageData(xx, yy, ww, hh)
  }
  return undefined
}
/**
 * put image data
 * @export
 * @param {Object} context canvas's context
 * @param {Object} img
 * @param {Number} xx
 * @param {Number} yy
 */
export function _putImageData (context, img, xx, yy) {
  if (context.putImageData) {
    context.putImageData(img, xx, yy)
  }
}

/**
 * set line width
 * @export
 * @param {Object} context canvas's context
 * @param {Number} l line width
 */
export function _setLineWidth (context, l) {
  context.lineWidth = l
}

/**
 * get line width
 * @export
 * @param {Object} context canvas's context
 * @return {Number} line width
 */
export function _getLineWidth (context) {
  return context.lineWidth
}

// 画竖线
/**
 * draw vertical line
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx
 * @param {Number} yy1
 * @param {Number} yy2
 */
export function _drawVline (context, xx, yy1, yy2) {
  context.moveTo(xx, yy1)
  context.lineTo(xx, yy2)
}
// 画横线
/**
 * draw horizontal line
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx1
 * @param {Number} xx2
 * @param {Number} yy
 */
export function _drawHline (context, xx1, xx2, yy) {
  context.moveTo(xx1, yy)
  context.lineTo(xx2, yy)
}
// 画斜线
/**
 * draw line
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx1
 * @param {Number} yy1
 * @param {Number} xx2
 * @param {Number} yy2
 */
export function _drawline (context, xx1, yy1, xx2, yy2) {
  context.moveTo(xx1, yy1)
  context.lineTo(xx2, yy2)
}

/**
 * move to position
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx
 * @param {Number} yy
 */
export function _drawmoveTo (context, xx, yy) {
  context.moveTo(xx, yy)
}

/**
 * draw line to
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx
 * @param {Number} yy
 */
export function _drawlineTo (context, xx, yy) {
  context.lineTo(xx, yy)
}

// 画空心长方形
/**
 * draw empty rect
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx
 * @param {Number} yy
 * @param {Number} ww
 * @param {Number} hh
 */
export function _drawRect (context, xx, yy, ww, hh) {
  context.strokeRect(xx, yy, ww, hh) // 这里的宽度是指不算xx的起始点的宽度，所以你写宽5，实际出来图形是6个像素，
}
// 画实心长方形
/**
 * draw fill rect
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx
 * @param {Number} yy
 * @param {Number} ww
 * @param {Number} hh
 * @param {String} fillclr
 */
export function _fillRect (context, xx, yy, ww, hh, fillclr) {
  context.fillStyle = fillclr || context.fillStyle
  context.fillRect(xx, yy, ww, hh)
}
/**
 * clear rect
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx
 * @param {Number} yy
 * @param {Number} ww
 * @param {Number} hh
 */
export function _clearRect (context, xx, yy, ww, hh) {
  context.clearRect(xx, yy, ww, hh)
}
// 画实心长方形
/**
 * fill by color
 * @export
 * @param {Object} context canvas's context
 * @param {String} fillclr
 */
export function _fill (context, fillclr) {
  context.fillStyle = fillclr
  context.fill()
}
// 开始画线
/**
 * start draw line
 * @export
 * @param {Object} context canvas's context
 * @param {String} clr
 */
export function _drawBegin (context, clr) {
  context.beginPath()
  context.strokeStyle = clr || context.strokeStyle
}

// 结束画线
/**
 * end draw
 * @export
 * @param {Object} context canvas's context
 */
export function _drawEnd (context) {
  context.stroke()
}

/**
 * get beveling
 * @private
 * @param {Number} x
 * @param {Number} y
 * @return {Number}
 */
function __getBeveling (x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}
/**
 * draw dash line
 * @export
 * @param {Object} context canvas's context
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @param {Number} dashLen
 */
export function _drawDashLine (context, x1, y1, x2, y2, dashLen) {
  dashLen = dashLen === undefined ? 5 : dashLen
  // 得到斜边的总长度
  const beveling = __getBeveling(x2 - x1, y2 - y1)
  // 计算有多少个线段
  const num = Math.floor(beveling / dashLen)

  for (let i = 0; i < num; i++) {
    context[i % 2 === 0 ? 'moveTo' : 'lineTo'](x1 + (x2 - x1) / num * i, y1 + (y2 - y1) / num * i)
  }
  // context.stroke();
}

// 以下显示文字

/**
 * set font size
 * @export
 * @param {Object} context canvas's context
 * @param {String} font
 * @param {Number} pixel
 */
export function _setFontSize (context, font, pixel) {
  context.font = pixel + 'px ' + font
}
/**
 * draw text
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx
 * @param {Number} yy
 * @param {String} txt
 * @param {String} font
 * @param {Number} pixel
 * @param {String} clr
 * @param {Object} pos
 */
export function _drawTxt (context, xx, yy, txt, font, pixel, clr, pos) {
  _setFontSize(context, font, pixel)
  context.fillStyle = clr || context.fillStyle
  context.textBaseline = pos ? pos.y || 'top' : 'top' // top（默认）；middle bottom
  context.textAlign = pos ? pos.x || 'start' : 'start' // start（默认）;center end
  // 需要将txt转为string类型，不然gcanvas会报错
  context.fillText(txt.toString(), xx, yy)
}

/**
 * get text width from charmap by fontsize
 * @param {Object} charMap
 * @param {String} txt
 * @param {Number} fontSize
 * @return {Number}
 */
function getTxtWith (charMap, txt, fontSize) {
  const scale = fontSize / 12
  let allWidth = 0
  for (let i = 0; i < txt.length; i++) {
    const element = txt[i].toString()
    if (charMap && charMap[element]) {
      allWidth += charMap[element].width
    } else {
      allWidth += 12
    }
  }
  return allWidth * scale
}
/**
 * get text width
 * @export
 * @param {Object} context canvas's context
 * @param {String} txt
 * @param {String} font
 * @param {Number} pixel
 * @return {Number} string width
 */
export function _getTxtWidth (context, txt, font, pixel) {
  _setFontSize(context, font, pixel)
  let width
  if (context.measureText) {
    try {
      width = context.measureText(txt).width
    } catch (error) {
      width = getTxtWith(context.charMap, txt, pixel)
    }
    // 简单的计算尺寸返回，这样子计算存在误差，特别是存在中英文的时候
  } else {
    width = getTxtWith(context.charMap, txt, pixel)
  }
  return width
}
// export function _getTxtWidth (context, txt, font, pixel) {
//   _setFontSize(context, font, pixel)
//   let width
//   if (context.measureText) {
//     try {
//       width = context.measureText(txt).width
//     } catch (error) {
//       // 简单的计算尺寸返回，这样子计算存在误差，特别是存在中英文的时候
//       width = pixel * txt.length
//     }
//   }
//   return width
// }

// 获取文字显示的最适合的Rect
/**
 * get text bound rect
 * @param {Object} context canvas's context
 * @param {String} txt
 * @param {Object} config
 * @return {Object}
 */
function __getTxtRect (context, txt, config) {
  const spaceX = config.spaceX || 2
  const spaceY = config.spaceY || 2
  const len = _getTxtWidth(context, txt, config.font, config.pixel)
  return { width: len + 2 * spaceX, height: config.pixel + spaceY * 2 }
}
// 把文本画在矩形内
/**
 * draw text rect
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx
 * @param {Number} yy
 * @param {String} txt
 * @param {Object} config
 */
export function _drawTxtRect (context, xx, yy, txt, config) {
  const spaceX = config.spaceX || 2
  const spaceY = config.spaceY || 2
  const tr = __getTxtRect(context, txt, config)

  let xxx, yyy
  yyy = yy // top
  xxx = xx // start
  if (config.y === 'middle') yyy = yy - Math.floor(tr.height / 2) // middle
  if (config.x === 'end') xxx = xx - tr.width
  if (config.x === 'center') xxx = xx - Math.floor(tr.width / 2)
  _fillRect(context, xxx, yyy, tr.width, tr.height, config.bakclr)

  _drawBegin(context, config.clr)
  _drawRect(context, xxx, yyy, tr.width, tr.height)
  xxx = xx
  yyy = yy
  if (config.x === 'start') xxx = xx + spaceX // ||config.x==='center'
  if (config.x === 'end') xxx = xx - spaceX
  if (config.y === 'top') yyy = yy - spaceY
  _drawTxt(context, xxx, yyy, txt, config.font, config.pixel, config.clr, {
    x: config.x,
    y: config.y
  })
  _drawEnd(context)
}

// 画空心圆
/**
 * draw circle
 * @export
 * @param {Object} context canvas's context
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 */
export function _drawCircle (context, x, y, r) {
  context.moveTo(x + r, y)
  context.arc(x, y, r, 0, Math.PI * 2, true)
}

// 画实心圆
/**
 * draw circle center point
 * @param {Object} context canvas's context
 * @param {Number} x
 * @param {Number} y
 * @param {Number} r
 * @param {String} clr
 */
function _drawCircleAndFilled (context, x, y, r, clr) {
  context.moveTo(x + r, y)
  context.arc(x, y, r, 0, Math.PI * 2, true)
  context.fillStyle = clr
  context.fill()
}

// 画一根独立的线，不影响后面的画线颜色
/**
 * draw a alone lien
 * @export
 * @param {Object} context canvas's context
 * @param {Number} xx
 * @param {Number} yy
 * @param {Number} xx1
 * @param {Number} yy1
 * @param {String} clr
 */
export function _drawLineAlone (context, xx, yy, xx1, yy1, clr) {
  const oldclr = context.strokeStyle
  _drawBegin(context, clr)
  context.moveTo(xx, yy)
  context.lineTo(xx1, yy1)
  _drawEnd(context)
  context.strokeStyle = oldclr
}

// 画一个椭圆
/**
 * draw a ellipse
 * @export
 * @param {Object} context canvas's context
 * @param {Number} x
 * @param {Number} y
 * @param {Number} a
 * @param {Number} b
 * @param {Number} h
 */
export function _BezierEllipse (context, x, y, a, b, h) {
  const k = 0.5522848
  const ox = a * k // 水平控制点偏移量
  const oy = b * k // 垂直控制点偏移量

  context.beginPath()
  // 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
  if (!h) {
    context.moveTo(x - a, y)
    context.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b)
    context.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y)
    context.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b)
    context.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y)
    context.closePath()
  } else {
    context.moveTo(x, y - b)
    context.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y)
    context.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b)
  }
  context.stroke()
}

// 画一个LOGO
/**
 * draw logo
 * @export
 * @param {any} context
 * @param {any} xx
 * @param {any} yy
 * @param {any} size
 */
export function _drawLogo (context, xx, yy, size) {
  context.beginPath()
  const lw = size

  context.lineWidth = lw
  context.strokeStyle = '#efefef'

  context.moveTo(xx - 0.5 * lw, yy) // 创建开始点
  context.lineTo(xx + 5.5 * lw, yy) // 创建水平线
  context.moveTo(xx, yy) // 创建开始点
  context.lineTo(xx, yy + 13 * lw) // 创建水平线
  context.moveTo(xx - 3 * lw, yy + 13 * lw) // 创建开始点
  context.lineTo(xx + 5.5 * lw, yy + 13 * lw) // 创建水平线

  context.moveTo(xx + 10 * lw, yy + 3.5 * lw)
  context.lineTo(xx + 13.5 * lw, yy + 3.5 * lw) // 创建水平线
  context.moveTo(xx + 10 * lw, yy + 9.5 * lw)
  context.lineTo(xx + 13.5 * lw, yy + 9.5 * lw) // 创建水平线
  context.stroke()

  _BezierEllipse(context, xx + 5.5 * lw, yy + 6.5 * lw, 5 * lw, 6.5 * lw, true)
  _BezierEllipse(context, xx + 9 * lw, yy + 6.5 * lw, 5 * lw, 6.5 * lw)
  context.fillStyle = '#000'
  context.fillRect(xx + 8.5 * lw, yy + 4 * lw, 6 * lw, 5 * lw)
}

// 以下函数只能调用上面的函数,不能直接画图

// data {o,h,l,c}
/**
 * draw sign plot
 * @export
 * @param {Object} context canvas's context
 * @param {Number} x
 * @param {Number} y
 * @param {Object} Arc1
 * @param {Object} Arc2
 */
export function _drawSignPlot (context, x, y, Arc1, Arc2) {
  if (Arc1 !== undefined && Arc1.r > 0) {
    _drawBegin(context, Arc1.clr)
    _drawmoveTo(context, x - Arc1.r, y)
    _drawlineTo(context, x + Arc1.r, y)
    _drawlineTo(context, x, y + 2 * Arc1.r)
    _drawlineTo(context, x - Arc1.r, y)
    _fill(context, Arc1.clr)
    _drawCircleAndFilled(context, x, y, Arc1.r, Arc1.clr)
    _drawEnd(context)
  }
  if (Arc2 !== undefined && Arc2.r > 0) {
    _drawBegin(context, Arc2.clr)
    _drawCircleAndFilled(context, x, y, Arc2.r, Arc2.clr)
    _drawEnd(context)
  }
}
/**
 * draw sign circle
 * @export
 * @param {Object} context canvas's context
 * @param {Number} x
 * @param {Number} y
 * @param {Object} Arc1
 * @param {Object} Arc2
 * @param {Object} Arc3
 */
export function _drawSignCircle (context, x, y, Arc1, Arc2, Arc3) {
  if (Arc1 !== undefined && Arc1.r > 0) {
    _drawBegin(context, Arc1.clr)
    _drawCircleAndFilled(context, x, y, Arc1.r, Arc1.clr)
    _drawEnd(context)
  }
  if (Arc2 !== undefined && Arc2.r > 0) {
    _drawBegin(context, Arc2.clr)
    _drawCircleAndFilled(context, x, y, Arc2.r, Arc2.clr)
    _drawEnd(context)
  }
  if (Arc3 !== undefined && Arc3.r > 0) {
    _drawBegin(context, Arc3.clr)
    _drawCircleAndFilled(context, x, y, Arc3.r, Arc3.clr)
    _drawEnd(context)
  }
}
/**
 * draw sing horizontal line
 * @export
 * @param {Object} context canvas's context
 * @param {Object} config
 * @param {Object} item
 */
export function _drawSignHLine (context, config, item) {
  _drawBegin(context, config.clr)
  _drawDashLine(context, config.xx, config.yy, config.right - config.pixel / 2, config.yy, 7)
  _drawEnd(context)

  const spaceX = config.spaceX || config.linew * 2
  const spaceY = config.spaceY || config.linew

  config.width = config.right - config.xx
  for (let i = 0; i < item.length; i++) {
    if (item[i].display === 'false') continue
    let xx = config.xx + config.width * item[i].set / 100
    if (item[i].txt === 'arc') {
      if ((xx + item[i].maxR) > config.right) xx = config.right - item[i].maxR
      _drawSignCircle(context, xx, config.yy,
        { r: item[i].maxR, clr: config.clr },
        { r: item[i].minR, clr: config.bakclr }
      )
    } else {
      const tr = __getTxtRect(context, item[i].txt, {
        font: config.font, pixel: config.pixel, spaceX, spaceY
      })
      if ((xx + tr.width) > config.right) xx = config.right - tr.width
      let yy = config.yy
      if (config.top && yy < config.top + tr.height / 2) {
        yy = config.top + tr.height / 2
      }
      if (config.bottom && yy > config.bottom - tr.height / 2) {
        yy = config.bottom - tr.height / 2
      }
      _drawTxtRect(context, xx, yy, item[i].txt, {
        font: config.font,
        pixel: config.pixel,
        clr: config.clr,
        bakclr: config.bakclr,
        x: 'start',
        y: config.y,
        spaceX,
        spaceY
      })
    }
  }
}
/**
 * draw sign vertical line
 * @export
 * @param {Object} context canvas's context
 * @param {Object} config
 * @param {Object} item
 */
export function _drawSignVLine (context, config, item) {
  _drawBegin(context, config.clr)
  _drawDashLine(context, config.xx, config.yy, config.xx, config.bottom - config.pixel / 2, 7)
  _drawEnd(context)

  const spaceX = config.spaceX || config.linew * 2
  const spaceY = config.spaceY || config.linew
  config.height = config.bottom - config.yy
  for (let i = 0; i < item.length; i++) {
    if (item[i].display === 'false') continue
    let yy = config.yy + config.height * item[i].set / 100

    if (item[i].txt === 'arc') {
      if ((yy + item[i].maxR) > config.bottom) yy = config.bottom - item[i].maxR
      _drawSignCircle(context, config.xx, yy,
        { r: item[i].maxR, clr: config.clr },
        { r: item[i].minR, clr: config.bakclr }
      )
    } else {
      const tr = __getTxtRect(context, item[i].txt, {
        font: config.font, pixel: config.pixel, spaceX, spaceY
      })
      if ((yy + tr.height) > config.bottom) yy = config.bottom - tr.height
      let xx = config.xx
      if (config.left && xx < config.left + tr.width / 2) {
        xx = config.left + tr.width / 2
      }
      _drawTxtRect(context, xx, yy, item[i].txt, {
        font: config.font,
        pixel: config.pixel,
        clr: config.clr,
        bakclr: config.bakclr,
        x: 'center',
        y: 'middle',
        spaceX,
        spaceY
      })
    }
  }
}
// { index:k, unitX: unitX, spaceX:spaceX, unitY:unitY,maxmin:mm},
// data {o,h,l,c}
/**
 * draw kbar
 * @export
 * @param {Object} context canvas's context
 * @param {Object} config
 * @param {Object} item
 */
export function _drawKBar (context, config, item) {
  const xx = config.rect.left + config.index * (config.unitX + config.spaceX)
  const xxm = xx + Math.floor(config.unitX / 2)
  const yyh = config.rect.top + Math.round((config.maxmin.max - item[1]) * config.unitY)
  const yyl = config.rect.top + config.rect.height - Math.round((item[2] - config.maxmin.min) * config.unitY)
  let hh

  const yy = config.rect.top + Math.round((config.maxmin.max - item[0]) * config.unitY)

  if (item[0] === item[3]) {
    hh = 0
    _drawHline(context, xx, xx + config.unitX, yy)
    if (item[1] > item[2]) {
      _drawVline(context, xxm, yyh, yyl)
    }
  } else {
    hh = Math.round((item[0] - item[3]) * config.unitY)
    _drawVline(context, xxm, yyh, yy)
    if (config.filled) {
      _fillRect(context, xx, yy, config.unitX, hh, config.fillclr)
    } else {
      _drawRect(context, xx, yy, config.unitX, hh)
    }
    _drawVline(context, xxm, yy + hh, yyl)
  }
}
// data {o,h,l,c}
/**
 * draw volume bar
 * @export
 * @param {Object} context canvas's context
 * @param {Object} config
 * @param {Object} value
 */
export function _drawVBar (context, config, value) {
  const xx = config.rect.left + config.index * (config.unitX + config.spaceX)
  const yy = config.rect.top + Math.round((config.maxmin.max - value) * config.unitY)
  const hh = config.rect.top + config.rect.height - yy
  if (config.filled) {
    _fillRect(context, xx, yy, config.unitX, hh, config.fillclr)
  } else {
    _drawRect(context, xx, yy, config.unitX, hh)
  }
}
/**
 * draw volume bar
 * @export
 * @param {Object} context canvas's context
 * @param {Object} config
 * @param {Object} value
 */
export function _drawZVBar (context, config, value) {
  const xx = config.rect.left + config.index * (config.unitX + config.spaceX)
  if (value > 0)
  {
    let hh = Math.round((config.maxmin.max - value) * config.unitY)
    const yy = config.rect.top + hh
    hh = config.rect.height / 2 - hh
    // console.log('_drawZVBar', xx, yy, config.unitX, hh)
    
    _fillRect(context, xx, yy, config.unitX, hh, config.fillclr)
  }
  else if (value < 0)
  {
    let hh = Math.round((value - config.maxmin.min) * config.unitY)
    const yy = config.rect.top + config.rect.height / 2
    hh = config.rect.height / 2 - hh
    // console.log('_drawZVBar', xx, yy, config.unitX, hh)
    _fillRect(context, xx, yy, config.unitX, hh, config.fillclr)
  }
}
// 以下函数为辅助画图的工具函数
// Adjust 灰度

// 为传入的16进制颜色增加透明度 ‘#1F1F2F’ -> rgba(...)
/**
 * transfer color to rgba
 * @export
 * @param {String} scolor
 * @param {Number} trans
 * @param {String} style
 * @return {String}
 */
export function _setTransColor (scolor, trans, style) {
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  let sColor = scolor.toLowerCase()
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      let sColorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
      }
      sColor = sColorNew
    }
    // 处理六位的颜色值
    const sColorChange = []
    for (let i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
    }
    // 效果处理
    switch (style) {
      case 'adjust':
        const r = sColorChange[0]
        const g = sColorChange[1]
        const b = sColorChange[2]
        sColorChange[0] = (r * 0.272) + (g * 0.534) + (b * 0.131)
        sColorChange[1] = (r * 0.349) + (g * 0.686) + (b * 0.168)
        sColorChange[2] = (r * 0.393) + (g * 0.769) + (b * 0.189)
        break
    }
    sColor = sColorChange.join(',')
    trans = trans || 1
    return 'rgba(' + sColor + ',' + trans + ')'
  } else {
    return sColor
  }
}
