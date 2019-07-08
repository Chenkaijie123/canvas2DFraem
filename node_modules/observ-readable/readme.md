# observ-readable [![Build Status](https://travis-ci.org/bendrucker/observ-readable.svg?branch=master)](https://travis-ci.org/bendrucker/observ-readable)

> Create a read-only observable interface


## Install

```
$ npm install --save observ-readable
```


## Usage

```js
var Readable = require('observ-readable')
var Struct = require('observ-readable/struct')
var Observ = require('observ')
var observable = Observ('foo')
var readable = Readable(observable)

readable()
//=> foo

readable.set('bar')
//=> TypeError: readable.set is not a function

var struct = Struct({
  foo: Readable('bar')
})
struct.foo()
//=> bar

struct()
//=> {foo: 'bar'}

struct.set({foo: 'baz'})
//=> TypeError...
```

## API

#### `Readable(observable)` -> `function`

##### observable

*Required*  
Type: `function` / `any`

An observable to wrap. You can also pass in a normal value and a new observable will be created.

#### `Struct(data)` -> `function`

##### data

*Required*  
Type: `object`

Data to pass to [observ-struct](https://github.com/raynos/observ-struct).


## License

MIT © [Ben Drucker](http://bendrucker.me)
