# observ-listen [![Build Status](https://travis-ci.org/bendrucker/observ-listen.svg?branch=master)](https://travis-ci.org/bendrucker/observ-listen)

> Trigger observ/watch or normal listening via a single interface


## Install

```
$ npm install --save observ-listen
```


## Usage

```js
var Observ = require('observ')
var listen = require('observ-listen')
var observable = Observ()

// Listen
listen(observable, function (value) {
  //=> 1
})
observable.set(1)

// Watch
listen(observable, function (value) {
  //=> 1
}, true)
```

## API

#### `listen(observable, fn, [watch])` -> `function`

Returns an unlisten function.

##### observable

*Required*  
Type: `function`

An observable like from [observ](https://github.com/raynos/observ).

##### fn

*Required*  
Type: `function`

A listener to call when the observable changes and initially if `watch` is set.

##### watch

Type: `boolean`  
Default: `false`

If true, the listener will be called immediately with the current value.

## License

MIT © [Ben Drucker](http://bendrucker.me)
