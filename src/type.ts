import { Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs'

export type RxSubject<T> =
  | Subject<T>
  | BehaviorSubject<T | undefined>
  | ReplaySubject<T>
  | AsyncSubject<T>
