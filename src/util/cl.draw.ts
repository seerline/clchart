export type FillStyle = string | CanvasGradient | CanvasPattern
export interface CharMap {
  [s: string]: { width: number }
}
export interface Context extends CanvasRenderingContext2D {
  charMap: CharMap
}
export interface FontConfig {
  spaceX: number
  spaceY: number
  font: string
  pixel: number
  clr: string
  bakclr: string
  x: 'start' | 'center' | 'end'
  y: 'middle' | 'top' | 'bottom'
}

export interface SignConfig {
  linew: number
  xx: number
  yy: number
  right: number
  clr: FillStyle
  bakclr: FillStyle
  font: string
  pixel: number
  spaceX: number
  spaceY: number
  x: number
  y: number
}

/** -----------------------tool functions---------------------------- */
// get beveling
function getBeveling(x: number, y: number) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
}

/** -----------------------draw functions---------------------------- */

// set line width
export function setLineWidth(ctx: Context, l: number) {
  ctx.lineWidth = l
}
// get line width
export function getLineWidth(ctx: Context) {
  return ctx.lineWidth
}

// draw vertical line
export function drawVline(ctx: Context, x: number, y1: number, y2: number) {
  ctx.moveTo(x, y1)
  ctx.lineTo(x, y2)
}

// draw horizontal line
export function drawHline(ctx: Context, x1: number, x2: number, y: number) {
  ctx.moveTo(x1, y)
  ctx.lineTo(x2, y)
}

// draw diagonal line
export function drawline(ctx: Context, x1: number, y1: number, x2: number, y2: number) {
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
}

// moveTo position
export function drawmoveTo(ctx: Context, x: number, y: number) {
  ctx.moveTo(x, y)
}

// draw lineTo
export function drawlineTo(ctx: Context, x: number, y: number) {
  ctx.lineTo(x, y)
}

// draw hollow rect
// The width here refers to the width of the starting point without x, so you write the width 5, and the actual figure is 6 pixels
export function drawRect(ctx: Context, x: number, y: number, w: number, h: number) {
  ctx.strokeRect(x, y, w, h)
}

// fill rect
export function fillRect(
  ctx: Context,
  x: number,
  y: number,
  w: number,
  h: number,
  fillclr: FillStyle
) {
  ctx.fillStyle = fillclr || ctx.fillStyle
  ctx.fillRect(x, y, w, h)
}

// clear rect
export function clearRect(ctx: Context, x: number, y: number, w: number, h: number) {
  ctx.clearRect(x, y, w, h)
}

// fill by color
export function fill(ctx: Context, fillclr: FillStyle) {
  ctx.fillStyle = fillclr
  ctx.fill()
}

// begin draw line
export function drawBegin(ctx: Context, clr: FillStyle) {
  ctx.beginPath()
  ctx.strokeStyle = clr || ctx.strokeStyle
}

// end draw line
export function drawEnd(ctx: Context) {
  ctx.stroke()
}

// draw dash line
export function drawDashLine(
  ctx: Context,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dashLen: number = 5
) {
  // get the total length of the hypotenuse
  const beveling = getBeveling(x2 - x1, y2 - y1)
  // calculate how many line segments there are
  const num = Math.floor(beveling / dashLen)
  for (let i = 0; i < num; i++) {
    ctx[i % 2 === 0 ? 'moveTo' : 'lineTo'](x1 + ((x2 - x1) / num) * i, y1 + ((y2 - y1) / num) * i)
  }
  // ctx.stroke();
}

/** -----------------------font functions---------------------------- */

// set font size
export function setFontSize(ctx: Context, font: string, pixel: number) {
  ctx.font = `${pixel}px ${font}`
}

// draw text
export function drawTxt(
  ctx: Context,
  x: number,
  y: number,
  txt: string,
  font: string,
  pixel: number,
  clr: FillStyle,
  pos?: { x: CanvasTextAlign; y: CanvasTextBaseline }
) {
  setFontSize(ctx, font, pixel)
  ctx.fillStyle = clr || ctx.fillStyle
  ctx.textBaseline = pos ? pos.y || 'top' : 'top'
  ctx.textAlign = pos ? pos.x || 'start' : 'start'
  ctx.fillText(txt, x, y)
}

// get text width from charmap by fontsize
function getTxtWith(charMap: CharMap, txt: string, fontSize: number) {
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

// get text width
export function getTxtWidth(ctx: Context, txt: string, font: string, pixel: number) {
  setFontSize(ctx, font, pixel)
  let width
  if (ctx.measureText) {
    try {
      width = ctx.measureText(txt).width
    } catch (error) {
      width = getTxtWith(ctx.charMap, txt, pixel)
    }
    // 简单的计算尺寸返回，这样子计算存在误差，特别是存在中英文的时候
  } else {
    width = getTxtWith(ctx.charMap, txt, pixel)
  }
  return width
}

// Get the most suitable Rect for text display
function getTxtRect(ctx: Context, txt: string, config: FontConfig) {
  const spaceX = config.spaceX || 2
  const spaceY = config.spaceY || 2
  const len = getTxtWidth(ctx, txt, config.font, config.pixel)
  return { width: len + 2 * spaceX, height: config.pixel + spaceY * 2 }
}

// Todo: refactor
// draw text rect
export function drawTxtRect(ctx: Context, x: number, y: number, txt: string, config: FontConfig) {
  const spaceX = config.spaceX || 2
  const spaceY = config.spaceY || 2
  const txtRect = getTxtRect(ctx, txt, config)

  let yyy = y // top
  let xxx = x // start
  if (config.y === 'middle') yyy = y - Math.floor(txtRect.height / 2) // middle
  if (config.x === 'end') xxx = x - txtRect.width
  if (config.x === 'center') xxx = x - Math.floor(txtRect.width / 2)
  fillRect(ctx, xxx, yyy, txtRect.width, txtRect.height, config.bakclr)

  drawBegin(ctx, config.clr)
  drawRect(ctx, xxx, yyy, txtRect.width, txtRect.height)
  xxx = x
  yyy = y
  if (config.x === 'start') xxx = x + spaceX // ||config.x==='center'
  if (config.x === 'end') xxx = x - spaceX
  if (config.y === 'top') yyy = y - spaceY
  drawTxt(ctx, xxx, yyy, txt, config.font, config.pixel, config.clr, {
    x: config.x,
    y: config.y
  })
  drawEnd(ctx)
}

// draw hollow circle
export function drawCircle(ctx: Context, x: number, y: number, r: number) {
  ctx.moveTo(x + r, y)
  ctx.arc(x, y, r, 0, Math.PI * 2, true)
}

// draw circle and filled
function drawCircleAndFilled(ctx: Context, x: number, y: number, r: number, clr: FillStyle) {
  ctx.moveTo(x + r, y)
  ctx.arc(x, y, r, 0, Math.PI * 2, true)
  ctx.fillStyle = clr
  ctx.fill()
}

// draw a alone lien
export function drawLineAlone(
  ctx: Context,
  x: number,
  y: number,
  x1: number,
  y1: number,
  clr: FillStyle
) {
  const oldclr = ctx.strokeStyle
  drawBegin(ctx, clr)
  ctx.moveTo(x, y)
  ctx.lineTo(x1, y1)
  drawEnd(ctx)
  ctx.strokeStyle = oldclr
}

// draw a ellipse
export function bezierEllipse(ctx: Context, x: number, y: number, a: number, b: number, h: number) {
  const k = 0.5522848
  const ox = a * k // horizontal control point offset
  const oy = b * k // vertical control point offset

  ctx.beginPath()
  // draw four cubic Bezier curves clockwise from the left endpoint of the ellipse
  if (!h) {
    ctx.moveTo(x - a, y)
    ctx.bezierCurveTo(x - a, y - oy, x - ox, y - b, x, y - b)
    ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y)
    ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b)
    ctx.bezierCurveTo(x - ox, y + b, x - a, y + oy, x - a, y)
    ctx.closePath()
  } else {
    ctx.moveTo(x, y - b)
    ctx.bezierCurveTo(x + ox, y - b, x + a, y - oy, x + a, y)
    ctx.bezierCurveTo(x + a, y + oy, x + ox, y + b, x, y + b)
  }
  ctx.stroke()
}

/** -----The following function can only call the above function, not directly draw----- */

interface ArcConfig {
  r: number
  clr: FillStyle
}
// draw sign plot
export function drawSignPlot(
  ctx: Context,
  x: number,
  y: number,
  arc1?: ArcConfig,
  arc2?: ArcConfig
) {
  if (arc1 !== undefined && arc1.r > 0) {
    drawBegin(ctx, arc1.clr)
    drawmoveTo(ctx, x - arc1.r, y)
    drawlineTo(ctx, x + arc1.r, y)
    drawlineTo(ctx, x, y + 2 * arc1.r)
    drawlineTo(ctx, x - arc1.r, y)
    fill(ctx, arc1.clr)
    drawCircleAndFilled(ctx, x, y, arc1.r, arc1.clr)
    drawEnd(ctx)
  }
  if (arc2 !== undefined && arc2.r > 0) {
    drawBegin(ctx, arc2.clr)
    drawCircleAndFilled(ctx, x, y, arc2.r, arc2.clr)
    drawEnd(ctx)
  }
}

// draw sign circle
export function drawSignCircle(
  ctx: Context,
  x: number,
  y: number,
  arc1?: ArcConfig,
  arc2?: ArcConfig,
  arc3?: ArcConfig
) {
  if (arc1 !== undefined && arc1.r > 0) {
    drawBegin(ctx, arc1.clr)
    drawCircleAndFilled(ctx, x, y, arc1.r, arc1.clr)
    drawEnd(ctx)
  }
  if (arc2 !== undefined && arc2.r > 0) {
    drawBegin(ctx, arc2.clr)
    drawCircleAndFilled(ctx, x, y, arc2.r, arc2.clr)
    drawEnd(ctx)
  }
  if (arc3 !== undefined && arc3.r > 0) {
    drawBegin(ctx, arc3.clr)
    drawCircleAndFilled(ctx, x, y, arc3.r, arc3.clr)
    drawEnd(ctx)
  }
}

// draw sign horizontal line
export function drawSignHLine(ctx: Context, config: any, item: any[]) {
  drawBegin(ctx, config.clr)
  drawDashLine(ctx, config.x, config.y, config.right - config.pixel / 2, config.y, 7)
  drawEnd(ctx)

  const spaceX = config.spaceX || config.linew * 2
  const spaceY = config.spaceY || config.linew

  config.width = config.right - config.x
  for (let i = 0; i < item.length; i++) {
    if (item[i].display === 'false') continue
    let x = config.x + (config.width * item[i].set) / 100
    if (item[i].txt === 'arc') {
      if (x + item[i].maxR > config.right) x = config.right - item[i].maxR
      drawSignCircle(
        ctx,
        x,
        config.y,
        { r: item[i].maxR, clr: config.clr },
        { r: item[i].minR, clr: config.bakclr }
      )
    } else {
      const txtRect = getTxtRect(ctx, item[i].txt, {
        font: config.font,
        pixel: config.pixel,
        spaceX,
        spaceY
      })
      if (x + txtRect.width > config.right) x = config.right - txtRect.width
      let y = config.y
      if (config.top && y < config.top + txtRect.height / 2) {
        y = config.top + txtRect.height / 2
      }
      if (config.bottom && y > config.bottom - txtRect.height / 2) {
        y = config.bottom - txtRect.height / 2
      }
      drawTxtRect(ctx, x, y, item[i].txt, {
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

// draw sign vertical line
export function _drawSignVLine(ctx: Context, config: any, item: any[]) {
  drawBegin(ctx, config.clr)
  drawDashLine(ctx, config.x, config.y, config.x, config.bottom - config.pixel / 2, 7)
  drawEnd(ctx)

  const spaceX = config.spaceX || config.linew * 2
  const spaceY = config.spaceY || config.linew
  config.height = config.bottom - config.y
  for (let i = 0; i < item.length; i++) {
    if (item[i].display === 'false') continue
    let y = config.y + (config.height * item[i].set) / 100

    if (item[i].txt === 'arc') {
      if (y + item[i].maxR > config.bottom) y = config.bottom - item[i].maxR
      drawSignCircle(
        ctx,
        config.x,
        y,
        { r: item[i].maxR, clr: config.clr },
        { r: item[i].minR, clr: config.bakclr }
      )
    } else {
      const tr = getTxtRect(ctx, item[i].txt, {
        font: config.font,
        pixel: config.pixel,
        spaceX,
        spaceY
      })
      if (y + tr.height > config.bottom) y = config.bottom - tr.height
      let x = config.x
      if (config.left && x < config.left + tr.width / 2) {
        x = config.left + tr.width / 2
      }
      drawTxtRect(ctx, x, y, item[i].txt, {
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

// draw kbar
export function drawKBar(ctx: Context, config: any, item: any[]) {
  const x = config.rect.left + config.index * (config.unitX + config.spaceX)
  const xxm = x + Math.floor(config.unitX / 2)
  const yyh = config.rect.top + Math.round((config.maxmin.max - item[1]) * config.unitY)
  const yyl =
    config.rect.top + config.rect.height - Math.round((item[2] - config.maxmin.min) * config.unitY)
  let h

  const y = config.rect.top + Math.round((config.maxmin.max - item[0]) * config.unitY)

  if (item[0] === item[3]) {
    h = 0
    drawHline(ctx, x, x + config.unitX, y)
    if (item[1] > item[2]) {
      drawVline(ctx, xxm, yyh, yyl)
    }
  } else {
    h = Math.round((item[0] - item[3]) * config.unitY)
    drawVline(ctx, xxm, yyh, y)
    if (config.filled) {
      fillRect(ctx, x, y, config.unitX, h, config.fillclr)
    } else {
      drawRect(ctx, x, y, config.unitX, h)
    }
    drawVline(ctx, xxm, y + h, yyl)
  }
}

// draw volume bar
export function _drawVBar(ctx: Context, config: any, value: number) {
  const x = config.rect.left + config.index * (config.unitX + config.spaceX)
  const y = config.rect.top + Math.round((config.maxmin.max - value) * config.unitY)
  const h = config.rect.top + config.rect.height - y
  if (config.filled) {
    fillRect(ctx, x, y, config.unitX, h, config.fillclr)
  } else {
    drawRect(ctx, x, y, config.unitX, h)
  }
}

// transfer color to rgba
export function setTransColor(scolor: string, trans: number, style: string) {
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
      sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2), 10))
    }
    // 效果处理
    switch (style) {
      case 'adjust':
        const r = sColorChange[0]
        const g = sColorChange[1]
        const b = sColorChange[2]
        sColorChange[0] = r * 0.272 + g * 0.534 + b * 0.131
        sColorChange[1] = r * 0.349 + g * 0.686 + b * 0.168
        sColorChange[2] = r * 0.393 + g * 0.769 + b * 0.189
        break
    }
    sColor = sColorChange.join(',')
    trans = trans || 1
    return 'rgba(' + sColor + ',' + trans + ')'
  } else {
    return sColor
  }
}
