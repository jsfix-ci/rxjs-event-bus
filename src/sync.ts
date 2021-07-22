import EventEmitter from 'eventemitter3'

export const syncBus = new EventEmitter() // Use to construct a sync bus for simple usage;

type Fn = (...args: any[]) => void

class SyncEvent<T> {
  ev: string
  listeners: Fn[] = []
  constructor(ev: string) {
    this.ev = ev
  }

  next(arg?: T) {
    syncBus.emit(this.ev, arg)
  }

  subscribe(fn: Fn) {
    syncBus.on(this.ev, fn)
    this.listeners.push(fn)
    return () => {
      syncBus.removeListener(this.ev, fn)
      this.listeners.splice(this.listeners.indexOf(fn), 1)
    }
  }
}

export default SyncEvent
