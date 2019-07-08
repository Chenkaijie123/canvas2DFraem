'use strict'

var window = require('global/window')
var Event = require('geval')

module.exports = HashHistory

function HashHistory (initialHash) {
  observable.set = set
  var listen = hashChangeEvent()

  if (initialHash) set(initialHash)

  return observable

  function observable (fn) {
    return fn ? listen(fn) : get()
  }
}

function hashChangeEvent () {
  if (!window.location) return

  return Event(function (broadcast) {
    window.addEventListener('hashchange', function (event) {
      broadcast(get())
    })
  })
}

function set (path) {
  if (!window.location) return

  if (path.charAt(0) !== '/') path = '/' + path
  if (path.charAt(0) !== '#') path = '#' + path

  window.location.hash = path
}

function get () {
  if (!window.location) return

  var path = window.location.hash || ''

  if (path.charAt(0) === '#') path = path.substring(1)
  if (path.charAt(0) !== '/') path = '/' + path

  return path
}
