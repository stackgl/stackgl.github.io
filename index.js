var slice  = require('sliced')
var splash = document.getElementById('splash')
var canvas = splash.querySelector('canvas')

require('./lib/fill')(document.querySelectorAll('[data-fill]'))
require('splash-grid')(canvas)
