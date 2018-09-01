/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/*
  The canvas needs to have two methods
  eventCanvas: {
    addEventListener: () => {},
    removeEventListener: () => {}
  }
*/

/*
  // Event object required attributes
  event: {
    touches: [
      pageX: 0,
      pageY: 0,
      offsetX: 0,
      offsetY: 0,
    ],
    changedTouches: [],
    target: {
      getBoundingClientRect: () => {}
    },
    preventDefault: () => {}
  }
*/

/**
 * Get distance
 * @param {Number} xLen
 * @param {Number} yLen
 * @return {Number}
 */
function _getDistance (xLen, yLen) {
  return Math.sqrt(xLen * xLen + yLen * yLen)
}
/**
 * Get the rotation direction of the vector
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

function _getTouchInfo (point, element) {
  const mouseInfo = {
    name: 'touch'
  }
  if (point.offsetX && point.offsetX === 0) {
    mouseInfo.offsetX = point.offsetX
    mouseInfo.offsetY = point.offsetY
  } else {
    let srcRect = {
      left: 0,
      top: 0
    }
    if (element && typeof element.getBoundingClientRect === 'function') srcRect = element.getBoundingClientRect()
    mouseInfo.offsetX = point.pageX - srcRect.left
    mouseInfo.offsetY = point.pageY - srcRect.top
  }
  return mouseInfo
}

function _getEventInfo (event) {
  return {
    offsetX: event.offsetX,
    offsetY: event.offsetY
  }
}

/**
 * Class representing ClEventHandler
 * @export
 * @class ClEventHandler
 */
export default class ClEventHandler {
  /**
   * Creates an instance of ClEventHandler.
   * @param {Object} {
   * father,
   * eventBuild,
   * isTouch
   * }
   * @constructor
   */
  constructor ({father, eventBuild, isTouch}) {
    this.father = father
    this.eventCanvas = father.eventCanvas
    if (typeof eventBuild === 'function') {
      this.eventBuild = eventBuild
    } else {
      this.eventBuild = (e) => e
    }
    // Determine whether touch event is supported
    this.isTouch = !!isTouch

    // Remove long press popup button
    this.eventCanvas.addEventListener && this.eventCanvas.addEventListener('contextmenu', e => {
      e.preventDefault()
    })
  }
  /**
   * bind evnet
   * @memberof ClEventHandler
   */
  bindEvent () {
    if (this.isTouch) {
      this.addHandler('touchstart', this.touchstart.bind(this))
      this.addHandler('touchend', this.touchend.bind(this))
      this.addHandler('touchmove', this.touchmove.bind(this))
    } else {
      this.addHandler('mousemove', this.mousemove.bind(this))
      // this.addHandler('mousein', this.mousein.bind(this));
      this.addHandler('mouseout', this.mouseout.bind(this))
      this.addHandler('mousewheel', this.mousewheel.bind(this))
      this.addHandler('mouseup', this.mouseup.bind(this))
      this.addHandler('mousedown', this.mousedown.bind(this))
      this.addHandler('keyup', this.keyup.bind(this))
      this.addHandler('keydown', this.keydown.bind(this))

      this.addHandler('click', this.click.bind(this))
    }
  }
  /**
   * clear event listener
   * @memberof ClEventHandler
   */
  clearEvent () {
    if (this.isTouch) {
      this.clearHandler('touchstart', this.touchstart.bind(this))
      this.clearHandler('touchend', this.touchend.bind(this))
      this.clearHandler('touchmove', this.touchmove.bind(this))
    } else {
      this.clearHandler('mousemove', this.mousemove.bind(this))
      // this.clearHandler('mousein', this.mousein.bind(this));
      this.clearHandler('mouseout', this.mouseout.bind(this))
      this.clearHandler('mousewheel', this.mousewheel.bind(this))
      this.clearHandler('mouseup', this.mouseup.bind(this))
      this.clearHandler('mousedown', this.mousedown.bind(this))
      this.clearHandler('keyup', this.keyup.bind(this))
      this.clearHandler('keydown', this.keydown.bind(this))

      this.clearHandler('click', this.click.bind(this))
    }
  }
  /**
   * add handle for events
   * @param {String} eventName
   * @param {Function} handler
   * @memberof ClEventHandler
   */
  addHandler (eventName, handler) {
    if (this.eventCanvas.addEventListener) {
      this.eventCanvas.addEventListener(eventName, handler, false)
    } else if (this.eventCanvas.attachEvent) {
      this.eventCanvas.attachEvent('on' + eventName, handler)
    } else {
      this.eventCanvas['on' + eventName] = handler
    }
  }
  /**
   * Clean up all binding events
   * @param {String} eventName
   * @param {Function} handler
   * @memberof ClEventHandler
   */
  clearHandler (eventName, handler) {
    if (this.eventCanvas.removeEventListener) {
      this.eventCanvas.removeEventListener(eventName, handler, false)
    } else if (this.eventCanvas.deattachEvent) {
      this.eventCanvas.deattachEvent('on' + eventName, handler)
    } else {
      this.eventCanvas['on' + eventName] = null
    }
  }
  // The following is an event handler
  /**
   * mouse move
   * @param {Object} event
   * @memberof ClEventHandler
   */
  mousemove (event) {
    this.father.emitEvent('onMouseMove', _getEventInfo(event))
  }
  /**
   * mouse in
   * @param {Object} event
   * @memberof ClEventHandler
   */
  mousein (event) {
    this.father.emitEvent('onMouseIn', _getEventInfo(event))
  }
  /**
   * mouse out
   * @param {Object} event
   * @memberof ClEventHandler
   */
  mouseout (event) {
    this.father.emitEvent('onMouseOut', _getEventInfo(event))
  }
  /**
   * mouse whell
   * @param {Object} event
   * @memberof ClEventHandler
   */
  mousewheel (event) {
    const info = _getEventInfo(event)
    info.deltaY = event.deltaY
    this.father.emitEvent('onMouseWheel', info)
  }
  /**
   * mouse up
   * @param {Object} event
   * @memberof ClEventHandler
   */
  mouseup (event) {
    this.father.emitEvent('onMouseUp', _getEventInfo(event))
  }
  /**
   * mouse down
   * @param {Object} event
   * @memberof ClEventHandler
   */
  mousedown (event) {
    this.father.emitEvent('onMouseDown', _getEventInfo(event))
  }
  // keyboard event
  /**
   * key up
   * @param {Object} event
   * @memberof ClEventHandler
   */
  keyup (event) {
    const info = _getEventInfo(event)
    info.keyCode = event.keyCode
    this.father.emitEvent('onKeyUp', info)
  }
  /**
   * key down
   * @param {Object} event
   * @memberof ClEventHandler
   */
  keydown (event) {
    const info = _getEventInfo(event)
    info.keyCode = event.keyCode
    this.father.emitEvent('onKeyDown', info)
  }
  /**
   * click event
   * @param {Object} event
   * @memberof ClEventHandler
   */
  click (event) {
    this.father.emitEvent('onClick', _getEventInfo(event))
  }
  /**
   * touchstart
   * @param {Object} e
   * @memberof ClEventHandler
   */
  touchstart (e) {
    const event = this.eventBuild(e)
    this.__timestamp = new Date()
    const point = event.touches ? event.touches[0] : event
    this.startX = point.pageX
    this.startY = point.pageY
    clearTimeout(this.longTapTimeout)
    this.startTime = Date.now()
    // Two-point touch
    if (event.touches.length > 1) {
      const point2 = event.touches[1]
      const xLen = Math.abs(point2.pageX - this.startX)
      const yLen = Math.abs(point2.pageY - this.startY)
      this.touchDistance = _getDistance(xLen, yLen)
      this.touchVector = {
        x: point2.pageX - this.startX,
        y: point2.pageY - this.startY
      }
    } else {
      this.longTapTimeout = setTimeout(() => {
        this.father.emitEvent('onLongPress', _getTouchInfo(point, event.target))
      }, 600)
      if (this.previousTouchPoint) {
        if (Math.abs(this.startX - this.previousTouchPoint.startX) < 10 &&
          Math.abs(this.startY - this.previousTouchPoint.startY) < 10 &&
          Math.abs(this.startTime - this.previousTouchTime) < 300) {
          this.father.emitEvent('onDoubleClick', _getTouchInfo(point, event.target))
        }
      }
      this.previousTouchTime = this.startTime
      this.previousTouchPoint = {
        startX: this.startX,
        startY: this.startY
      }
    }
  }
  /**
   * touchend
   * @param {Object} e
   * @memberof ClEventHandler
   */
  touchend (e) {
    const event = this.eventBuild(e)
    clearTimeout(this.longTapTimeout)
    const point = event.changedTouches ? event.changedTouches[0] : event
    const timestamp = Date.now()
    if ((this.moveX !== null && Math.abs(this.moveX - this.startX) > 10) ||
      (this.moveY !== null && Math.abs(this.moveY - this.startY) > 10)) {
      if (timestamp - this.startTime < 500) {
        this.father.emitEvent('onSwipe', _getTouchInfo(point, event.target))
      }
    } else if (timestamp - this.startTime < 2000) {
      if (timestamp - this.startTime < 500) {
        this.father.emitEvent('onClick', _getTouchInfo(point, event.target))
      }
      if (timestamp - this.startTime > 500) {
        this.father.emitEvent('onLongPress', _getTouchInfo(point, event.target))
      }
    }
    this.startX = this.startY = this.moveX = this.moveY = null
    this.previousPinchScale = 1
    this.father.emitEvent('onMouseOut', _getTouchInfo(point, event.target))
  }
  /**
   * touchmove
   * @param {Object} e
   * @memberof ClEventHandler
   */
  touchmove (e) {
    const event = this.eventBuild(e)
    if (new Date() - this.__timestamp < 150) {
      return event
    }
    const timestamp = Date.now()
    if (event.touches.length > 1) {
      const xLen = Math.abs(event.touches[0].pageX - event.touches[1].pageX)
      const yLen = Math.abs(event.touches[0].pageY - event.touches[1].pageY)
      const touchDistance = _getDistance(xLen, yLen)
      // Calculate scaling events
      if (this.touchDistance) {
        const pinchScale = touchDistance / this.touchDistance
        const point = event.touches ? event.touches[0] : event
        // this._emitEvent('onPinch', { scale: pinchScale - this.previousPinchScale }); // 缩放
        const mouseinfo = _getTouchInfo(point, event.target)
        if ((timestamp - this.startTime) > 90 && this.previousPinchScale) {
          mouseinfo.scale = pinchScale - this.previousPinchScale
          if (Math.abs(mouseinfo.scale) > 0.01) {
            this.father.emitEvent('onPinch', mouseinfo)
          }
          this.startTime = Date.now()
        }
        this.previousPinchScale = pinchScale
      }
      // Calculating rotation events
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
      const config = _getTouchInfo(point, event.target)
      config.deltaX = deltaX
      config.deltaY = deltaY
      this.father.emitEvent('onMouseMove', config)
      this.moveX = point.pageX
      this.moveY = point.pageY
    }
    if (typeof event.preventDefault === 'function') event.preventDefault()
  }
}
