export default class Queue {
  constructor (consumer) {
    this.consumer = consumer
    this.queue = []
  }
  push (element) {
    this.queue.push(element)
    this.process()
  }
  process () {
    if (this.queue.length !== 0) {
      const ack = this.consumer(this.queue[0])
      if (ack) {
        this.queue.shift()
        this.process()
      }
    }
  }
  empty () {
    this.queue = []
  }
}
