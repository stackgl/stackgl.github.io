(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-54792490-1', 'auto');
ga('send', 'pageview');

var filter    = require('./lib/filter')
var minstache = require('minstache')
var domify    = require('domify')
var slice     = require('sliced')
var fs        = require('fs')

var grid  = document.getElementById('grid').querySelector('canvas')
var flock = document.getElementById('community').querySelector('canvas')

require('./lib/fill')(document.querySelectorAll('[data-fill]'))

if (window.chrome) {
  try {
    require('@stackgl/splash-grid')(grid)
    require('@stackgl/splash-flock')(flock)
  } catch(e) {
    console.error(e.message)
  }
}

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
