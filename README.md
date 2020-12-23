# @21epub/rxjs-event-bus

> Made with create-storybook-react-library

[![NPM](https://img.shields.io/npm/v/@21epub/rxjs-event-bus.svg)](https://www.npmjs.com/package/@21epub/rxjs-event-bus) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://img.shields.io/travis/com/21epub/rxjs-event-bus)](https://travis-ci.com/github/21epub/rxjs-event-bus) [![Codecov](https://img.shields.io/codecov/c/github/21epub/rxjs-event-bus)](https://codecov.io/gh/21epub/rxjs-event-bus)

## Intro

This is a component for react.

## Feature

- [x] Easy-to-use
- [x] Typescript Support
- [x] Storybook UI component

## Install

```bash
npm install --save @21epub/rxjs-event-bus
```

## Usage

```tsx
import React, { Component } from 'react'

import MyComponent from '@21epub/rxjs-event-bus'
import '@21epub/rxjs-event-bus/dist/index.css'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
```

For Details: See Example

## Developing and running on localhost

First install dependencies and then install peerDeps for storybook dev:

```sh
npm install
npm run install-peers
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
