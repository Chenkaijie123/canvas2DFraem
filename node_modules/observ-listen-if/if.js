'use strict'

var Thunk = require('observ-thunk')
var pipe = require('value-pipe')
var listen = require('observ-listen')
var once = require('once')

module.exports = function Observer (watch) {
  return function listenIf (condition, value, fn) {
    var unlistenValue
    var onChange = Thunk(function (condition) {
      if (!condition) {
        return unlistenValue && unlistenValue()
      }
      unlistenValue = listen(value, fn, watch)
    })

    var unlistenCondition = listen(condition, pipe(Boolean, onChange), watch)

    return once(unlisten)

    function unlisten () {
      unlistenValue && unlistenValue()
      unlistenCondition && unlistenCondition()
    }
  }
}
