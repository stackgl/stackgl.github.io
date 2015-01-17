var filter    = require('../lib/filter')
var cl        = require('class-list')
var minstache = require('minstache')
var domify    = require('domify')
var slice     = require('sliced')
var fs        = require('fs')

require('../lib/fill')(document.querySelectorAll('[data-fill]'))

var thumb = minstache.compile(fs.readFileSync(
  __dirname + '/../lib/thumb.html'
, 'utf8'))

var examples = require('../build/examples.json').map(function(meta) {
  return thumb(meta)
}).join('\n')

console.log(examples)

document
  .getElementById('examples')
  .querySelector('ul.thumbs')
  .appendChild(domify(examples))
