# async-ear [![Build Status](https://travis-ci.org/bendrucker/async-ear.svg?branch=master)](https://travis-ci.org/bendrucker/async-ear)

> Manage and call async functions

async-ear can register and manage a set of functions to call in parallel (default) or series with the same arguments.

## Install

```
$ npm install --save async-ear
```


## Usage

```js
var Ear = require('async-ear')
// or Ear = require('async-ear/series')

var listeners = Ear()
listeners.add(function (a, callback) {
  //=> a === 1
  callback()
})
listeners(1, function done (err) {
  //=> err === null  
})
```

## API

#### `Listeners()` -> `function`

Create a new listener group. Returns a `listeners` function that will call all listeners with the provided arguments. The listeners should provide a callback as its last argument which will be called with an error (or `null`).

#### `listeners.add(listener)` -> `function`

Adds a new listener. Returns a `remove` function that will remove the new listener when called. Each listener should expect a callback as its final argument.

##### listener

*Required*  
Type: `function`
Arguments: `args..., callback`

A listener to trigger when the parent function is called.

## Related
* [ear](https://github.com/bendrucker/ear): synchronous version

## License

MIT © [Ben Drucker](http://bendrucker.me)
