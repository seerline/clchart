'use strict'

// /////////////////////////////////////////////////
// 定义特定函数
// ////////////////////////////////////////////////

function _getTime () {
  return new Date().getTime()
}

function _getDistance (xLen, yLen) {
  return Math.sqrt(xLen * xLen + yLen * yLen)
}
/**
 * 获取向量的旋转方向
 */
function _getRotateDirection (vector1, vector2) {
  return vector1.x * vector2.y - vector2.x * vector1.y
}

function _getRotateAngle (vector1, vector2) {
  let direction = _getRotateDirection(vector1, vector2)
  direction = direction > 0 ? -1 : 1
  const len1 = _getDistance(vector1.x, vector1.y)
  const len2 = _getDistance(vector2.x, vector2.y)
  const mr = len1 * len2
  if (mr === 0) return 0
  const dot = vector1.x * vector2.x + vector1.y * vector2.y
  let r = dot / mr
  if (r > 1) r = 1
  if (r < -1) r = -1
  return Math.acos(r) * direction * 180 / Math.PI
}

function _getTouchInfo (point) {
  const mouseInfo = {
    name: 'touch'
  }
  let srcRect = {
    left: 0,
    top: 0
  }
  mouseInfo.offsetX = point.offsetX - srcRect.left
  mouseInfo.offsetY = point.offsetY - srcRect.top
  return mouseInfo
}

// /////////////////////////////////////////////////
// 定义事件监听接口
// ////////////////////////////////////////////////

export default function ClEventWeb (father) {
  this.father = father
  this.eventCanvas = father.eventCanvas

  this.bindEvent = function () {
    this.addHandler('touchstart', this.touchstart.bind(this))
    this.addHandler('touchend', this.touchend.bind(this))
    this.addHandler('touchmove', this.touchmove.bind(this))
  }
  this.clearEvent = function () {
    this.clearHandler('touchstart', this.touchstart.bind(this))
    this.clearHandler('touchend', this.touchend.bind(this))
    this.clearHandler('touchmove', this.touchmove.bind(this))
  }
  this.addHandler = function (eventName, handler) {
    this.eventCanvas.on(eventName, handler)
  }
  /* 清理所有的绑定事件 */
  this.clearHandler = function (eventName, handler) { /* Chrome */
    this.eventCanvas.removeListener(eventName, handler)
  }
  // /////////////////////
  // 下面时对事件的处理
  // /////////////////////
  this.getEventInfo = function (event) {
    return {
      offsetX: event.offsetX,
      offsetY: event.offsetY
    }
  }
  // 触摸
  this.touchstart = function (event) {
    this.__timestamp = new Date()
    const point = event.touches ? event.touches[0] : event
    this.startX = point.pageX
    this.startY = point.pageY
    clearTimeout(this.longTapTimeout)
    // 两点接触
    if (event.touches.length > 1) {
      const point2 = event.touches[1]
      const xLen = Math.abs(point2.pageX - this.startX)
      const yLen = Math.abs(point2.pageY - this.startY)
      this.touchDistance = _getDistance(xLen, yLen)
      this.touchVector = {
        x: point2.pageX - this.startX,
        y: point2.pageY - this.startY
      }
      this.startTime = _getTime()
    } else {
      this.startTime = _getTime()
      this.longTapTimeout = setTimeout(() => {
        // this._emitEvent('onLongPress');
        this.father.emitEvent('onLongPress', _getTouchInfo(point))
      }, 600)
      if (this.previousTouchPoint) {
        if (Math.abs(this.startX - this.previousTouchPoint.startX) < 10 &&
          Math.abs(this.startY - this.previousTouchPoint.startY) < 10 &&
          Math.abs(this.startTime - this.previousTouchTime) < 300) {
          // this._emitEvent('onDoubleTap');
          this.father.emitEvent('onDBClick', _getTouchInfo(point))
        }
      }
      this.previousTouchTime = this.startTime
      this.previousTouchPoint = {
        startX: this.startX,
        startY: this.startY
      }
    }
  }
  this.touchend = function (event) {
    /**
     * 在X轴或Y轴发生过移动
     */
    const point = event.changedTouches ? event.changedTouches[0] : event
    clearTimeout(this.longTapTimeout)
    const timestamp = _getTime()
    if ((this.moveX !== null && Math.abs(this.moveX - this.startX) > 10) ||
      (this.moveY !== null && Math.abs(this.moveY - this.startY) > 10)) {
      if (timestamp - this.startTime < 500) {
        // this._emitEvent('onSwipe'); // 挥手
        this.father.emitEvent('onSwipe', _getTouchInfo(point))
      }
    } else if (timestamp - this.startTime < 2000) {
      if (timestamp - this.startTime < 500) {
        // this._emitEvent('onTap'); // 单击
        this.father.emitEvent('onClick', _getTouchInfo(point))
      }
      if (timestamp - this.startTime > 500) {
        // this._emitEvent('onLongPress');
        this.father.emitEvent('onLongPress', _getTouchInfo(point))
      }
    }
    this.startX = this.startY = this.moveX = this.moveY = null
    this.previousPinchScale = 1
    this.father.emitEvent('onMouseOut', _getTouchInfo(point))
  }
  this.touchmove = function (event) {
    if (new Date() - this.__timestamp < 150) {
      return event
    }
    const timestamp = _getTime()
    if (event.touches.length > 1) {
      const xLen = Math.abs(event.touches[0].pageX - event.touches[1].pageX)
      const yLen = Math.abs(event.touches[1].pageY - event.touches[1].pageY)
      const touchDistance = _getDistance(xLen, yLen)
      if (this.touchDistance) {
        const pinchScale = touchDistance / this.touchDistance
        const point = event.touches ? event.touches[0] : event
        // this._emitEvent('onPinch', { scale: pinchScale - this.previousPinchScale }); // 缩放
        const mouseinfo = _getTouchInfo(point)
        if ((timestamp - this.startTime) > 90 && this.previousPinchScale) {
          mouseinfo.scale = pinchScale - this.previousPinchScale
          if (Math.abs(mouseinfo.scale) > 0.01) {
            this.father.emitEvent('onPinch', mouseinfo)
          }
          this.startTime = _getTime()
        }
        this.previousPinchScale = pinchScale
      }
      if (this.touchVector) {
        const vector = {
          x: event.touches[1].pageX - event.touches[0].pageX,
          y: event.touches[1].pageY - event.touches[0].pageY
        }
        const angle = _getRotateAngle(vector, this.touchVector)
        // this._emitEvent('onRotate', {
        //   angle
        // })
        this.father.emitEvent('onRotate', {
          angle
        })
        this.touchVector.x = vector.x
        this.touchVector.y = vector.y
      }
    } else {
      clearTimeout(this.longTapTimeout)
      const point = event.touches ? event.touches[0] : event
      const deltaX = this.moveX === null ? 0 : point.pageX - this.moveX
      const deltaY = this.moveY === null ? 0 : point.pageY - this.moveY
      // this._emitEvent('onMove', { deltaX, deltaY });
      const config = _getTouchInfo(point)
      config.deltaX = deltaX
      config.deltaY = deltaY
      this.father.emitEvent('onMouseMove', config)
      this.moveX = point.pageX
      this.moveY = point.pageY
    }
  }
}
