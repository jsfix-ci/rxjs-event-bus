/* eslint prefer-rest-params: 0 */
import { Subject } from 'rxjs'

const fakeSubject = ({
  next: () => {},
  complete: () => {},
  observers: []
} as unknown) as Subject<any>

export const enabled = function (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const callback = descriptor.value

  return {
    ...descriptor,
    value(ev: string) {
      const _disables = (this as any)?._disabledSubjects ?? []
      const args = arguments
      if (_disables.includes(ev)) {
        console.info('Event:', ev, ' is disabled')
        return fakeSubject
      } else return callback.apply(this, args)
    }
  }
}

export const exist = function (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const callback = descriptor.value

  return {
    ...descriptor,
    value() {
      const list = (this as any)[`_${propertyKey}`]
      const args = arguments
      const [ev] = args as any
      if (!list[ev]) {
        const msg = `Event: ${ev} is not registered! `
        throw new Error(msg)
      } else return callback.apply(this, args)
    }
  }
}

export const noExist = function (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const callback = descriptor.value

  return {
    ...descriptor,
    value() {
      const $this = this as any
      const args = arguments
      const [ev] = args as any
      if (typeof ev === 'string') {
        const exist =
          $this._subject[ev] ||
          $this._behaviorSubject[ev] ||
          $this._asyncSubject[ev] ||
          $this._replaySubject[ev]
        if (exist) {
          const msg = `Event: ${ev} has been already registered! `
          throw new Error(msg)
        } else return callback.apply(this, args)
      }
      return callback.apply(this, args)
    }
  }
}
