/* eslint no-fallthrough: 0 */
import { BehaviorSubject, Subject, ReplaySubject, AsyncSubject } from 'rxjs'
import { enabled, exist, noExist } from './decorator'

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

const SUPPORT_SUBJECTS: RxSubjectType[] = [
  'Subject',
  'BehaviorSubject',
  'AsyncSubject',
  'ReplaySubject'
]

class RxBus {
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

  private createReplaySubject<T>(ev: string): ReplaySubject<T> {
    const subject = new ReplaySubject<T>()
    if (!this._replaySubject[ev]) this._replaySubject[ev] = subject
    return subject
  }

  @noExist
  register<T>(
    ev: string | string[],
    type: RxSubjectType = 'Subject',
    initialValue?: T
  ): void | RxSubject<T> {
    if (typeof ev === 'string') {
      // do not allowed to register a same event name to different pool
      switch (type) {
        case 'Subject':
          this.createSubject<T>(ev)
        case 'AsyncSubject':
          this.createAsyncSubject<T>(ev)
        case 'BehaviorSubject':
          this.createBehaviorSubject<T | undefined>(ev, initialValue)
        case 'ReplaySubject':
          this.createReplaySubject<T>(ev)
      }
    } else if (ev?.length) {
      ev.map((s) => this.register(s, type, initialValue))
    }
  }

  @exist
  @enabled
  subject(ev: string) {
    return this._subject[ev] ?? this.register<any>(ev)
  }

  @exist
  @enabled
  behaviorSubject(ev: string) {
    return this._behaviorSubject[ev]
  }

  @exist
  @enabled
  replaySubject(ev: string) {
    return this._replaySubject[ev]
  }

  @exist
  @enabled
  asyncSubject(ev: string) {
    return this._asyncSubject[ev]
  }

  disable(ev: string) {
    if (!this._disabledSubjects.includes(ev))
      this._disabledSubjects = [...this._disabledSubjects, ev]
  }

  enable(ev: string) {
    if (this._disabledSubjects.includes(ev))
      this._disabledSubjects = [
        ...this._disabledSubjects.filter((v) => v !== ev)
      ]
  }

  remove(ev: string, type?: RxSubjectType) {
    // no type arg , will remove all the ev in different pool
    this.removeSubscriptions(ev, type)
    delete this._asyncSubject[ev]
    delete this._behaviorSubject[ev]
    delete this._replaySubject[ev]
    delete this._subject[ev]
  }

  removeSubscriptions(ev: string, type?: RxSubjectType) {
    const subjects = this.getAll(ev, type)
    subjects.forEach((subject) => {
      subject.observers.forEach((observer) => (observer as any).unsubscribe())
    })
  }

  get(ev: string, type?: RxSubjectType) {
    if (type) {
      switch (type) {
        case 'Subject':
          return this._subject[ev]
        case 'AsyncSubject':
          return this._asyncSubject[ev]
        case 'BehaviorSubject':
          return this._behaviorSubject[ev]
        case 'ReplaySubject':
          return this._replaySubject[ev]
      }
    } else return this._getAnySubject(ev)
  }

  private getAll(ev: string, type?: RxSubjectType): Array<RxSubject<any>> {
    const results: Array<RxSubject<any>> = []
    SUPPORT_SUBJECTS.forEach((s) => {
      ;(!type || type === s) && this.get(ev, s) && results.push(this.get(ev, s))
    })
    return results
  }

  private _getAnySubject(ev: string): RxSubject<any> {
    return (
      this._subject[ev] ??
      this._asyncSubject[ev] ??
      this._behaviorSubject[ev] ??
      this._replaySubject[ev]
    )
  }

  destroy() {
    Object.keys(this._asyncSubject).forEach((ev) =>
      this.removeSubscriptions(ev)
    )
    Object.keys(this._behaviorSubject).forEach((ev) =>
      this.removeSubscriptions(ev)
    )
    Object.keys(this._subject).forEach((ev) => this.removeSubscriptions(ev))
    Object.keys(this._replaySubject).forEach((ev) =>
      this.removeSubscriptions(ev)
    )
  }
}

export default RxBus
