# observ-listen-if [![Build Status](https://travis-ci.org/bendrucker/observ-listen-if.svg?branch=master)](https://travis-ci.org/bendrucker/observ-listen-if)

> Manage an observable listener based on another boolean observable


## Install

```
$ npm install --save observ-listen-if
```


## Usage

```js
var listenIf = require('observ-listen-if')
var Observ = require('observ')

var condition = Observ(false)
var value = Observ(0)

listenIf(condition, value, function (value) {
  //=> 2
})

value.set(1) // noop, condition === false

conditions.set(true)
value.set(2) // listener runs
```

To watch instead (triggering listeners immediately and upon change instead of just upon change):

```js
var watchIf = require('observ-listen-if/watch')
watchIf(condition, value, listener)
```

## API

#### `listenIf(condition, value, fn)` -> `function`

Returns an unlisten function. The listener will be called for changes to value when the condition is true.

##### condition

*Required*  
Type: `function`

An [observable](https://github.com/raynos/observ). The value can be anything but the value will be cast to a boolean before change detection occurs. The value listener will be removed when the condition becomes false.

##### value

*Required*  
Type: `function`

An [observable](https://github.com/raynos/observ) value.

##### fn

*Required*  
Type: `function`  
Arguments: `value`

A listener function to call when the value is set after the condition has become true.


## License

MIT © [Ben Drucker](http://bendrucker.me)
