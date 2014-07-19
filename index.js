var splash    = document.getElementById('splash')
var canvas    = splash.querySelector('canvas')
var minstache = require('minstache')
var domify    = require('domify')
var slice     = require('sliced')
var fs        = require('fs')

require('./lib/fill')(document.querySelectorAll('[data-fill]'))
require('splash-grid')(canvas)

var thumb = minstache.compile(fs.readFileSync(
  __dirname + '/lib/thumb.html'
, 'utf8'))

var examples = require('./build/examples.json').map(function(meta) {
  return thumb(meta)
}).join('\n')

document
  .getElementById('examples')
  .querySelector('ul')
  .appendChild(domify(examples))
