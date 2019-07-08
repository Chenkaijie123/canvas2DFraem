'use strict'

var createEar = require('./ear')
var parallel = require('run-parallel')

module.exports = createEar(parallel)
