import { Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs'
import SyncEvent from './sync'

export type RxSubject<T> =
  | Subject<T>
  | BehaviorSubject<T | undefined>
  | ReplaySubject<T>
  | AsyncSubject<T>
  | SyncEvent<T>
