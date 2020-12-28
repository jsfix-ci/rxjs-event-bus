/* eslint no-param-reassign: 0 */

import { RxSubject } from './type'

// const SUPPORT_SUBJECTS: RxSubjectType[] = [
//   'Subject',
//   'BehaviorSubject',
//   'AsyncSubject',
//   'ReplaySubject'
// ]

export const camelize = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

export const backupOrigin = (subject: RxSubject<any>) => {
  // a sideEffect to modifier the subject (maybe not a best choice )
  // in order to disable the next function
  if (!(subject as any).originNext) {
    ;(subject as any).originNext = subject.next
    subject.next = () => {}
  }
}

export const restoreOrigin = (subject: RxSubject<any>) => {
  if ((subject as any).originNext) {
    subject.next = (subject as any).originNext
    delete (subject as any).originNext
  }
}
