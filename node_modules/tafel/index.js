'use strict'

var Routington = require('routington')
var assert = require('assert-ok')
var assertEqual = require('assert-equal')
var createStore = require('weakmap-shim/create-store')

module.exports = Table

function Table () {
  var router = Routington()
  var store = createStore()

  return {
    add: add,
    match: match,
    path: path
  }

  function add (path) {
    var key = {path: path}

    assertEqual(typeof path, 'string')

    var node = router.define(path)[0]
    store(key).node = node
    node.key = key

    return key
  }

  function match (path) {
    var matched = router.match(path)

    return matched && {params: matched.param, key: matched.node.key}
  }

  function path (key, params) {
    assertEqual(typeof key, 'object')
    params = params || {}

    var node = store(key).node
    var parts = []
    while (node.parent) {
      var name = node.name
      if (name) assert(params[name] != null, 'invalid empty url parameter: ' + name)
      parts.push(name ? params[node.name] : node.string)
      node = node.parent
    }

    return parts.reverse().join('/')
  }
}
