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

document
  .getElementById('examples')
  .querySelector('ul.thumbs')
  .appendChild(domify(examples))

var contribs = require('../build/contributors.json')
var upper = Math.ceil(contribs.length * 0.1)

contribs = []
  .concat(contribs.slice(0, upper).sort(shuffle))
  .concat(contribs.slice(upper).sort(shuffle))
  .map(function (d) {
    return '<li class="contributor"><a title="' + d.name + '" href="https://github.com/' + d.name + '" style="background-image:url(\'' + d.image + '\')"></a></li>'
  }).join('')

document.getElementById('contributor-list')
  .appendChild(domify(contribs))

function shuffle () {
  return Math.random() - 0.5
}
