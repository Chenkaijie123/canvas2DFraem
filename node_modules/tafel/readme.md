# tafel [![Build Status](https://travis-ci.org/bendrucker/tafel.svg?branch=master)](https://travis-ci.org/bendrucker/tafel)

> Routing table built on [routington](https://github.com/pillarjs/routington)

Tafel encourages the creation of [weakmap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)-powered routers. Route definitions are immutable. Weakmapping eliminates the need to use paths or arbitrary string keys to store and manipulate routing state.


## Install

```
$ npm install --save tafel
```


## Usage

```js
var Table = require('tafel')
var table = Table()

var users = table.add('/users')
var user = table.add('/users/:id')

var match1 = table.match('/users')
//=> match1.key === users
//=> match1.params === {}

var match2 = table.match('/users/123')
//=> match2.key === user
//=> match2.params === {id: '123'}

table.path(user, {id: 123})
//=> /users/123
```

## API

#### `Table()` -> `object`

Creates a new routing table.

#### `table.add(path)` -> `object`

Defines a new route. Returns a `key` that can be used for weakmapping other data associated with routing.

##### path

*Required*  
Type: `string`

A routing path definition. See [routington.define](https://github.com/pillarjs/routington#nodes-node--routerdefineroute) for more details on defining paths.


#### `table.match(path)` -> `null` / `object`

Matches a path against the routing table. Returns `null` if no match was found. Otherwise returns an object with:

###### params

Type: `object`

Matched path params. For the route definition `/users/:id` and the path `/users/123`, the path params are `{id: '123'}`. Note that all values are strings.

###### key

Type: `object`

The same `key` returned by `table.add`. 

##### path

*Required*  
Type: `string`

An application path (not a path definition).

#### `table.path(key, [params])` -> `string`

Generates the path for a given route in the same form expected by `table.match` as input.

##### key

*Required*  
Type: `object`

The route key returned by `route.add`.

#### params

Type: `object`  
Default: `{}`

Path parameters to interpolate. Each parameter in the URL must be defined.

```js
var route = table.add({path: '/packages/:name'})
var path = table.path(route, {name: 'tafel'})
//=> /packages/tafel
```

## License

MIT © [Ben Drucker](http://bendrucker.me)
