// TDD before develop this function
import { Subscription } from 'rxjs'
import RxBus from '.'

// We wanna this module to provide 4 pool for events management , A pool for normal  , A pool for behavior and A pool for replay , A pool for Async by the tech of rxjs
beforeEach(() => {})

afterEach(() => {})

describe('Bus Basic function', () => {
  // const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  const rxBus = new RxBus()
  // events should pre register before usage , or it will prompts error info

  test('register event ok', () => {
    // It does not force to register before usage ( Recommended for specify interface of the event data )
    let eventCount = 0
    rxBus.register<string>('event1')
    expect(rxBus.subject('event1').next).toBeDefined() // to check if a event is exist in a range
    rxBus.subject('event1').subscribe(() => {
      eventCount++
    })
    rxBus.subject('event1').next()
    expect(eventCount).toBe(1)
  })

  test('should get events and getAll ok', () => {
    expect(rxBus.get('event1')).toBe(rxBus.subject('event1'))
  })

  test('should register mutiple events meanwhile ', () => {
    rxBus.register<string>(['event2', 'event3', 'event4'])
    expect(rxBus.subject('event2').next).toBeDefined()
    expect(rxBus.subject('event3').next).toBeDefined()
    expect(rxBus.subject('event4').next).toBeDefined()
  })

  test('should not register a exist event ', () => {
    expect(() => rxBus.register<string>('event1')).toThrow(
      'Event: event1 has been already registered!'
    )
  })

  test('should not allowed use before registered ', () => {
    expect(() => rxBus.subject('event5')).toThrow(
      'Event: event5 is not registered!'
    )
  })

  test('should tigger a event and subscribe to the event ', () => {
    let eventCount = 0
    const subscription = rxBus.subject('event2').subscribe((result) => {
      // subscribe before the event
      expect(result).toBe('ok')
      eventCount++
    })
    expect(subscription.unsubscribe).toBeDefined()
    const allSubs = rxBus.subject('event2').observers
    expect(
      ((allSubs as unknown) as Subscription[]).includes(subscription)
    ).toBeTruthy() // allSubs includes the subscription
    rxBus.subject('event2').next('ok')
    expect(eventCount).toBe(1)
  })

  test('should disable a event ok , to make it unReachable and then enable it again ', () => {
    let eventCount = 0
    rxBus.subject('event3').subscribe((result) => {
      // subscribe before the event
      expect(result).toBe('ok')
      eventCount++
    })
    rxBus.disable('event3')
    // ensure even the event is disabled but the subscribe function should worked
    expect(rxBus.subject('event3').subscribe).toBeDefined()
    rxBus.subject('event3').subscribe((result) => {
      // subscribe before the event
      expect(result).toBe('ok')
      eventCount++
    })
    rxBus.subject('event3').next('ok')
    expect(eventCount).toBe(0)
    rxBus.enable('event3')
    rxBus.subject('event3').next('ok')
    expect(eventCount).toBe(2)
  })

  test('should can remove all subscription to a event ', () => {
    let eventCount = 0
    rxBus.subject('event4').subscribe((results) => {
      eventCount++
      expect(results).toBe('ok')
    })
    rxBus.subject('event4').next('ok')
    expect(eventCount).toBe(1)
    rxBus.removeSubscriptions('event4')
    rxBus.subject('event4').next('ok1')
    expect(eventCount).toBe(1)
  })

  test('should remove a subject and it cannot be used', () => {
    rxBus.register<string>('event5')
    let eventCount = 0
    rxBus.subject('event5').subscribe((results) => {
      eventCount++
      expect(results).toBe('ok')
    })
    rxBus.subject('event5').next('ok')
    expect(eventCount).toBe(1)
    rxBus.remove('event5')
    expect(() => rxBus.subject('event5')).toThrowError()
    // and you can register it again
    rxBus.register<string>('event5')
  })

  test('should trigger a AsyncEvent that can only be fired once and catched once ', () => {
    let eventCount = 0
    rxBus.register<string>('eventAsync', 'AsyncSubject')
    rxBus.asyncSubject('eventAsync').next('ok')
    rxBus.asyncSubject('eventAsync').complete()
    rxBus.asyncSubject('eventAsync').subscribe((results) => {
      eventCount++
      expect(results).toBe('ok')
    })
    expect(eventCount).toBe(1)
    rxBus.asyncSubject('eventAsync').next('ok')
    rxBus.asyncSubject('eventAsync').complete()
    expect(eventCount).toBe(1)
  })

  test('should register a behaviourEvent that can memory the value of latest', () => {
    let eventCount = 0
    rxBus.register<string>('eventBehavior', 'BehaviorSubject')
    rxBus.behaviorSubject('eventBehavior').next('ok1')
    rxBus.behaviorSubject('eventBehavior').next('ok2')
    rxBus.behaviorSubject('eventBehavior').subscribe((results) => {
      eventCount++
      expect(results).toBe('ok2')
    })
    expect(eventCount).toBe(1)
  })

  test('should register a replayEvent that can replay all the event happened  ', () => {
    rxBus.register<string>('eventForReplay', 'ReplaySubject')

    let eventCount = 0
    const dataFC = function* data() {
      yield 'ok1'
      yield 'ok2'
    }

    const data = dataFC()
    rxBus.replaySubject('eventForReplay').next('ok1')
    rxBus.replaySubject('eventForReplay').next('ok2')
    rxBus.replaySubject('eventForReplay').subscribe((results) => {
      eventCount++
      expect(results).toBe(data.next().value)
    })
    expect(eventCount).toBe(2)
  })

  test('should remove a event and make it not works ', () => {
    rxBus.register<string>('eventForRemove')
    let eventCount = 0
    rxBus.subject('eventForRemove').subscribe((results) => {
      eventCount++
      expect(results).toBe('ok')
    })
    const subject = rxBus.subject('eventForRemove')
    subject.next('ok')
    rxBus.remove('eventForRemove')
    expect(eventCount).toBe(1)
    subject.next('ok')
    expect(eventCount).toBe(1)
  })

  test('should destroy all when the bus object are being destroyed ', () => {
    rxBus.destroy()
  })
})
