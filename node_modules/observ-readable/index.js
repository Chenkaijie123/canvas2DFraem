'use strict'

var isObserv = require('is-observ')
var Observ = require('observ')

module.exports = function Readable (observable) {
  observable = isObserv(observable) ? observable : Observ(observable)

  return function listen (fn) {
    return observable(fn)
  }
}
