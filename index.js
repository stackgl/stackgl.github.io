var splash    = document.getElementById('splash')
var canvas    = splash.querySelector('canvas')
var filter    = require('./lib/filter')
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

var packages = require('./build/packages.json')

packages = Object.keys(packages).reduce(function(pkgs, group) {
  return pkgs.concat(packages[group].map(function(pkg) {
    pkg.group = group
    return pkg
  }))
}, []).map(function(meta) {
  return thumb(meta)
}).join('\n')

document
  .getElementById('examples')
  .querySelector('ul.thumb-list')
  .appendChild(domify(examples))

var pkgEl = document.getElementById('packages')

pkgEl
  .querySelector('ul.thumb-list')
  .appendChild(domify(packages))

pkgEl
  .querySelector('ul.thumb-filter')
  .appendChild(filter(pkgEl))
