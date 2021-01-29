/* eslint prefer-rest-params: 0 */

const testEvType = ($this: any, ev: string): boolean => {
  return (
    $this._subject[ev] ||
    $this._behaviorSubject[ev] ||
    $this._asyncSubject[ev] ||
    $this._replaySubject[ev]
  )
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
        const msg = testEvType(this, ev)
          ? `Event: ${ev} is registered in other Type , Please Check and try other Type !!! `
          : `Event: ${ev} is not registered! `
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
