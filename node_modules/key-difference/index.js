'use strict'

var difference = require('array-differ')
var extend = require('xtend')

module.exports = function keyDifference (obj) {
  var others = [].slice.call(arguments, 1)
  var source = Object.keys(obj)
  var rest = Object.keys(extend.apply(null, others))
  return difference(source, rest)
}
