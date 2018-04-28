/**
 * Copyright (c) 2018-present clchart Contributors.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Class representing a event
 * @export
 * @class EV
 */
export default class EV {
  constructor () {
    this.handlers = {}
  }

  /**
   * emit an event
   * @param {String} event event name
   * @param {any} args event params
   * @memberof EV
   */
  emit (event, ...args) {
    if (this.handlers[event]) {
      this
        .handlers[event]
        .forEach((handler) => handler.apply(this, args))
    }
  }
  /**
   * emit with special scope
   * @param {any} event event name
   * @param {any} scope scope
   * @param {any} args event params
   * @memberof EV
   */
  emitWithScope (event, scope, ...args) {
    if (this.handlers[event]) {
      this
        .handlers[event]
        .forEach((handler) => handler.apply(scope, args))
    }
  }

  /**
   * listen event
   * @param {any} event event name
   * @param {any} callback listen callback
   * @memberof EV
   */
  on (event, callback) {
    if (!this.handlers[event]) {
      this.handlers[event] = []
    }
    this
      .handlers[event]
      .push(callback)
  }
  /**
   * listen only once
   * @param {any} event event name
   * @param {any} callback event listener callback function
   * @memberof EV
   */
  once (event, callback) {
    const self = this
    self.on(event, function onetimeCallback () {
      callback.apply(this, arguments)
      self.removeListener(event, onetimeCallback)
    })
  }
  /**
   * remove special event listener by callback function
   * @param {any} event event name
   * @param {any} callback event listener callback function
   * @memberof EV
   */
  removeListener (event, callback) {
    if (this.handlers[event]) {
      const index = this
        .handlers[event]
        .indexOf(callback)
      if (index > -1) {
        this
          .handlers[event]
          .splice(index, 1)
      }
    }
  }
  /**
   * remove all listeners for events
   * @param {any} event event name
   * @memberof EV
   */
  removeAllListeners (event) {
    this.handlers[event] = undefined
  }
};
