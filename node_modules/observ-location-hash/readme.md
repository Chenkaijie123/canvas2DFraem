# observ-location-hash [![Build Status](https://travis-ci.org/ajoslin/observ-location-hash.svg?branch=master)](https://travis-ci.org/ajoslin/observ-location-hash)

> Observable interface to the browser hash location

## Install

```
$ npm install --save observ-location-hash
```

## Usage

```js
var ObservHash = require('observ-location-hash')

var hash = ObservHash('/initial-path')

hash(function (hash) {
  //=> (called on window's hashchange event)
})

hash()
//=> returns current hash, minus '#' character

hash.set(path)
//=> sets current hash
```

## API

#### `ObservHash([initialPath])` -> `observHash`

#### `observHash([listener])` -> `function`

Returns an unlisten function.

##### listener

Type: `function`

A function to call with the current path when the hash changes.

#### `observHash.set(path)` -> `undefined`

Updates window.locaion.hash.

## Related

- [observ-history](https://github.com/bendrucker/observ-history)

## License

MIT © [Andrew Joslin](http://ajoslin.com)
