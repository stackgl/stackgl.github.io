var replace = require('replacestream')
var wrap    = require('wrap-stream')
var request = require('request')
var path    = require('path')
var url     = require('url')
var fs      = require('fs')

var wiki = 'https://github.com/stackgl/stackgl.github.io/wiki/'

;['examples'].forEach(function(slug) {
  var Slug = slug.slice(0, 1).toUpperCase() + slug.slice(1)
  var uri = url.resolve(wiki, Slug)
  var dst = path.join(__dirname, slug + '.md')

  request(uri + '.md')
    .pipe(replace('\r', ''))
    .pipe(wrap('# ' + Slug + '\n\n', '\n'))
    .pipe(fs.createWriteStream(dst))
    .once('close', function() {
      console.log('* updated ' + slug)
    })
})
