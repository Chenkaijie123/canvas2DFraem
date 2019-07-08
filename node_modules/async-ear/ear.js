'use strict'

var toArray = require('to-array')
var assertFn = require('assert-function')
var ap = require('ap')

module.exports = function createEar (run) {
  return function Ear () {
    var callbacks = []

    function listeners () {
      var args = toArray(arguments)
      var callback = args.pop()
      assertFn(callback)

      run(callbacks.map(ap.partial(ap, args)), callback)
    }

    listeners.add = function (listener) {
      assertFn(listener)
      callbacks.push(listener)
      return function remove () {
        var i = 0
        var length = callbacks.length
        for (; i < length; i++) {
          if (callbacks[i] === listener) {
            callbacks.splice(i, 1)
            return
          }
        }
      }
    }

    return listeners
  }
}
