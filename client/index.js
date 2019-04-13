import EventEmitter from './eventemitter'
import Queue from './queue'
import Socket from './socket'

let i = 0
export function uniqueId () {
  return (i++).toString()
}

const DEFAULT_RECONNECT_INTERVAL = 10000

export class Client extends EventEmitter {
  constructor (options) {
    super()

    this.calls = []

    this.status = 'disconnected'

    // Default `autoConnect` and `autoReconnect` to true
    this.autoConnect = options.autoConnect !== false
    this.autoReconnect = options.autoReconnect !== false
    this.reconnectInterval =
      options.reconnectInterval || DEFAULT_RECONNECT_INTERVAL

    this.messageQueue = new Queue(message => {
      if (this.status === 'connected') {
        this.socket.send(message)
        return true
      } else {
        return false
      }
    })

    this.socket = new Socket(options.SocketConstructor, options.endpoint)

    this.socket.on('open', () => {
      this.status = 'connected'
      this.messageQueue.process()
      this.emit('connected')
    })

    this.socket.on('close', () => {
      this.status = 'disconnected'
      this.messageQueue.empty()
      this.calls = []
      this.emit('disconnected')
      if (this.autoReconnect) {
        // Schedule a reconnection
        setTimeout(this.socket.open.bind(this.socket), this.reconnectInterval)
      }
    })

    this.socket.on('message:in', message => {
      this.invoke(message)
    })

    if (this.autoConnect) {
      this.connect()
    }
  }

  connect () {
    this.socket.open()
  }

  disconnect () {
    /*
     *   If `disconnect` is called, the caller likely doesn't want the
     *   the instance to try to auto-reconnect. Therefore we set the
     *   `autoReconnect` flag to false.
     */
    this.autoReconnect = false
    this.socket.close()
  }

  invoke (message) {
    const call = this.calls.find(call => call.id === message.id)
    // if can't find call return
    if (!call) {
      return console.log(`Cant find message: ${message} , callback`)
    }
    if (typeof call.callback === 'function') call.callback(message.result)
    this.calls.splice(this.calls.findIndex(call => call.id === message.id), 1)
  }

  _getData (code, key, params = {}, callback = () => {}) {
    const id = uniqueId()
    this.messageQueue.push({
      id,
      com: 'sisdb.get',
      key: `${code}.${key}`,
      argv: params
    })
    this.calls.push({
      id: id,
      callback: callback
    })
  }

  // promise method
  getData (code, key, params) {
    return new Promise((resolve, reject) => {
      try {
        this._getData(code, key, params, (data) => {
          resolve(data)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}
