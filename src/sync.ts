import EventEmitter from 'eventemitter3'

type Fn = (...args: any[]) => void

export const syncBus = new EventEmitter() // Use to construct a sync bus for simple usage;

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

  removeAllListener() {
    this.listeners.forEach((fn) => syncBus.removeListener(this.ev, fn))
  }
}

export default SyncEvent
