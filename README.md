# @21epub/rxjs-event-bus

> Made with create-storybook-react-library

[![NPM](https://img.shields.io/npm/v/@21epub/rxjs-event-bus.svg)](https://www.npmjs.com/package/@21epub/rxjs-event-bus) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://img.shields.io/travis/com/21epub/rxjs-event-bus)](https://travis-ci.com/github/21epub/rxjs-event-bus) [![Codecov](https://img.shields.io/codecov/c/github/21epub/rxjs-event-bus)](https://codecov.io/gh/21epub/rxjs-event-bus)

## Intro

This is a module for event management.

## Feature

- [x] Easy-to-use
- [x] Typescript Support
- [x] Rxjs
- [ ] Hooks support

## Install

```bash
npm install --save @21epub/rxjs-event-bus
```

## Usage

```ts
import RxBus from '@21epub/rxjs-event-bus'

// create instance
const rxBus = new RxBus()

// register events
rxBus.register<string>('event1')

// or register batch of events
rxBus.register<string>(['event1', 'event2'])

// subscribe to a event just like using rxjs subject
rxBus.subject('event1').subscribe((result) => console.log(result))

// tigger event
rxBus.subject('event1').next('ok')

// support Sync Event
rxBus.register('syncEvent', 'SyncSubject')
rxBus.syncSubject('syncEvent').subscribe((result) => console.log(result)) // something
rxBus.syncSubject('syncEvent').next('something')
```

## Developing and running on localhost

First install dependencies and then install peerDeps for storybook dev:

```sh
npm install
```

To run Example in hot module reloading mode:

```sh
npm start   # or npm run storybook
```

To create a bundle library module build:

```sh
npm run build
```

## Testing

To run unit tests:

```sh
npm test
```

## License

MIT © [21epub](https://github.com/21epub)
