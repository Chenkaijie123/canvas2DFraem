# soft-set [![Build Status](https://travis-ci.org/bendrucker/soft-set.svg?branch=master)](https://travis-ci.org/bendrucker/soft-set)

> Set an observable, only when the value is different


## Install

```
$ npm install --save soft-set
```


## Usage

```js
var Observable = require('observ')
var softSet = require('soft-set')

var observable = Observable(1)

softSet(observable, 1)
//=> noop

softSet(observable, 2)
observable()
//=> 2
```

## API

#### `softSet(observable, value)` -> `undefined`

##### observable

*Required*  
Type: `function`

An observable value (e.g. [observ](https://github.com/raynos/observ)) that:

* can be called to get its current value
* has a `set` method that changes the value

##### value

*Required*

The new value to soft set.

## License

MIT © [Ben Drucker](http://bendrucker.me)
