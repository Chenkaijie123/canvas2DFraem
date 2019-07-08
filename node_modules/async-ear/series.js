'use strict'

var createEar = require('./ear')
var series = require('run-series')

module.exports = createEar(series)
