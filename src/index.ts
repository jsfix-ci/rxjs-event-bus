/* eslint no-fallthrough: 0 */
import { BehaviorSubject, Subject, ReplaySubject, AsyncSubject } from 'rxjs'
import { exist, noExist } from './decorator'
import { backupOrigin, camelize, restoreOrigin } from './util'

type RxSubject<T> =
  | Subject<T>
  | BehaviorSubject<T | undefined>
  | ReplaySubject<T>
  | AsyncSubject<T>

type RxSubjectType =
  | 'Subject'
  | 'BehaviorSubject'
  | 'ReplaySubject'
  | 'AsyncSubject'

/**
 *  RxBus
 *  A event management using Rxjs
 *  All Rxjs functions and Operators for Subject are fully supported
 *  @example
 *  ```
 *    const rxBus = new RxBus();  // initialize
 *    rxBus.register('event1')  // register a default subject event
 *    rxBus.subject('event1').next()
 *    rxBus.subject('event1').subscribe( () => ...)
 *    rxBus.subject('event1').next('ok')  //  pass on data to event
 *
 *    rxBus.register('event2', 'BehaviorSubject', 1)  // support four types of subject by Rxjs
 *  ```
 */
class RxBus<P extends string> {
  private _subject: Record<string, Subject<any>> = {}
  private _behaviorSubject: Record<string, BehaviorSubject<any>> = {}
  private _replaySubject: Record<string, ReplaySubject<any>> = {}
  private _asyncSubject: Record<string, AsyncSubject<any>> = {}
  private _disabledSubjects: string[] = []
  constructor() {
    return this
  }

  private createSubject<T>(ev: string): Subject<T> {
    const subject = new Subject<T>()
    if (!this._subject[ev]) this._subject[ev] = subject
    return subject
  }

  private createAsyncSubject<T>(ev: string): AsyncSubject<T> {
    const subject = new AsyncSubject<T>()
    if (!this._asyncSubject[ev]) this._asyncSubject[ev] = subject
    return subject
  }

  private createBehaviorSubject<T>(
    ev: string,
    initialValue: T
  ): BehaviorSubject<T> {
    const subject = new BehaviorSubject<T>(initialValue)
    if (!this._behaviorSubject[ev]) this._behaviorSubject[ev] = subject
    return subject
  }

  private createReplaySubject<T>(
    ev: string,
    initialValue?: T,
    bufferSize?: number
  ): ReplaySubject<T> {
    const subject = new ReplaySubject<T>(bufferSize)
    if (initialValue) {
      subject.next(initialValue)
    }
    if (!this._replaySubject[ev]) this._replaySubject[ev] = subject
    return subject
  }

  /**
   * Register a event subject
   * Can not register same event twice
   * A event subject should be registered before usage
   * The subject Object is a rxjs Subject ,[Reference here](https://www.learnrxjs.io/learn-rxjs/subjects)
   * @param ev
   * @param type
   * @param initialValue  only for behaviorSubject or replaySubject
   * @param bufferSize only for replaySubject
   */
  @noExist
  register<T>(
    ev: string | string[],
    type: RxSubjectType = 'Subject',
    initialValue?: T,
    bufferSize?: number
  ): void | RxSubject<T> {
    if (typeof ev === 'string') {
      // do not allowed to register a same event name to different pool
      switch (type) {
        case 'Subject':
          this.createSubject<T>(ev)
          break
        case 'AsyncSubject':
          this.createAsyncSubject<T>(ev)
          break
        case 'BehaviorSubject':
          this.createBehaviorSubject<T | undefined>(ev, initialValue)
          break
        case 'ReplaySubject':
          this.createReplaySubject<T>(ev, initialValue, bufferSize)
          break
      }
    } else if (ev?.length) {
      ev.map((s) => this.register(s, type, initialValue))
    }
  }

  @exist
  subject(ev: P) {
    return this._subject[ev]
  }

  @exist
  behaviorSubject(ev: P) {
    return this._behaviorSubject[ev]
  }

  @exist
  replaySubject(ev: P) {
    return this._replaySubject[ev]
  }

  @exist
  asyncSubject(ev: P) {
    return this._asyncSubject[ev]
  }

  /**
   * Disable a event temporarily
   * Sometime you want a event to be disabled for some task or during sometime and to enable it again after finish
   * * caution : You should always use rxBus.subject(xxxx).next to execute event trigger or it will not working
   * @param ev
   */
  disable(ev: P) {
    const subject = this.get(ev)
    if (!this._disabledSubjects.includes(ev) && subject) {
      this._disabledSubjects = [...this._disabledSubjects, ev]
      backupOrigin(subject)
    }
  }

  enable(ev: P) {
    const subject = this.get(ev)
    if (this._disabledSubjects.includes(ev) && subject) {
      this._disabledSubjects = [
        ...this._disabledSubjects.filter((v) => v !== ev)
      ]
      restoreOrigin(subject)
    }
  }

  remove(ev: P, type?: RxSubjectType) {
    // no type arg , will remove all the ev in different pool
    this.removeSubscriptions(ev, type)
    delete this._asyncSubject[ev]
    delete this._behaviorSubject[ev]
    delete this._replaySubject[ev]
    delete this._subject[ev]
  }

  removeSubscriptions(ev: P, type?: RxSubjectType) {
    const subject = this.get(ev, type)
    subject.observers.forEach((observer) => (observer as any).unsubscribe())
  }

  get(ev: P, type?: RxSubjectType): RxSubject<any> {
    if (type) {
      const list = (this as any)[`_${camelize(type)}`]
      return list[ev]
    } else return this._getAnySubject(ev)
  }

  private _getAnySubject(ev: P): RxSubject<any> {
    return (
      this._subject[ev] ??
      this._asyncSubject[ev] ??
      this._behaviorSubject[ev] ??
      this._replaySubject[ev]
    )
  }

  destroy() {
    ;[
      this._asyncSubject,
      this._behaviorSubject,
      this._subject,
      this._replaySubject
    ].forEach((rxSubject) => {
      Object.keys(rxSubject).forEach((ev) => {
        this.removeSubscriptions(ev as P)
        rxSubject[ev].complete()
      })
    })
  }
}

export default RxBus
