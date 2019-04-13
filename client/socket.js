import EventEmitter from './eventemitter'

export default class Socket extends EventEmitter {
  constructor (SocketConstructor, endpoint) {
    super()
    this.SocketConstructor = SocketConstructor
    this.endpoint = endpoint
    this.rawSocket = null
  }

  send (object) {
    if (!this.closing && object.id !== undefined) {
      const id = object.id
      delete object.id
      const message = JSON.stringify(object)
      this.rawSocket.send(`${id}:${message}`)
      // Emit a copy of the object, as the listener might mutate it.
      this.emit('message:out', JSON.parse(message))
    }
  }

  open () {
    if (this.rawSocket) {
      return
    }
    this.closing = false
    this.rawSocket = new this.SocketConstructor(this.endpoint)

    this.rawSocket.onopen = () => this.emit('open')
    this.rawSocket.onclose = () => {
      this.rawSocket = null
      this.emit('close')
      this.closing = false
    }
    this.rawSocket.onmessage = message => {
      var object
      try {
        const data = message.data
        const markIndx = data.indexOf(':')
        const id = data.substr(0, markIndx)
        const result = data.substr(markIndx + 1)
        object = {
          result: JSON.parse(result),
          id
        }
      } catch (ignore) {
        // Simply ignore the malformed message and return
        return
      }
      this.emit('message:in', object)
    }
  }

  close () {
    if (this.rawSocket) {
      this.closing = true
      this.rawSocket.close()
    }
  }
}
