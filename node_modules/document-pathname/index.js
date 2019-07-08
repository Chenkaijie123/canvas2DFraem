'use strict'

var location = require('global/document').location

module.exports = function pathname () {
  return location ? location.pathname : '/'
}
