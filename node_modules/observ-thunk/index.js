'use strict'

module.exports = function ObservThunk (fn) {
  var previous
  return function thunk (value) {
    if (value === previous) return
    previous = value
    fn(value)
  }
}
