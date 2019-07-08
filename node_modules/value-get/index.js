'use strict'

var dot = require('dot-prop')
var partial = require('ap').partial

module.exports = function valueGet (path, obj) {
  if (arguments.length < 2) return partial(valueGet, path)
  return getter(path)(obj, path)
}

function getter (path) {
  return /\./.test(path) ? dot.get : get
}

function get (obj, key) {
  return obj[key]
}
