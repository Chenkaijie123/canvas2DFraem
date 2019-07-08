'use strict'

module.exports = softSet

function softSet (observable, value) {
  if (observable() !== value) observable.set(value)
}
