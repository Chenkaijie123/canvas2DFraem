# value-get [![Build Status](https://travis-ci.org/bendrucker/value-get.svg?branch=master)](https://travis-ci.org/bendrucker/value-get)

> Create functional property getters


## Install

```
$ npm install --save value-get
```


## Usage

```js
var get = require('value-get')

get('foo', {foo: 'bar'})
//=> bar

var getFoo = get('foo')
getFoo({foo: 'bar'})
//=> bar

var getDeepBar = get('foo.bar')
getDeepBar({foo: {bar: 'baz'}})
//=> baz
```

## API

#### `get(path, [obj])` -> `any`

##### path

*Required*  
Type: `string`

The string key path. The path can be a normal key or use dot property syntax for deep access. If you need an actual dot, escape it:

```js
get('foo\\.bar', {'foo.bar': 'baz'})
//=> baz
```

##### obj

Type: `object`

The object to get the value from. If no object is supplied, a partially applied function with the path will be returned.


## License

MIT © [Ben Drucker](http://bendrucker.me)
