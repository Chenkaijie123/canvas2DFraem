'use strict'

var observWatch = require('observ/watch')
var partial = require('ap').partial

module.exports = function observListen (observable, fn, watch) {
  var listen = watch ? partial(observWatch, observable) : observable
  return listen(fn)
}
