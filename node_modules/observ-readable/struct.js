'use strict'

var pipe = require('value-pipe')
var Struct = require('observ-struct')
var Readable = require('./')

module.exports = function ReadableStruct (data) {
  return pipe(Readable, Struct)(data)
}
