var tree    = require('markdown-tree')
var cheerio = require('cheerio')
var marked  = require('marked')
var unhtml  = require('unhtml')
var path    = require('path')
var fs      = require('fs')

console.error()
console.error('extracting examples')

var examples = tree(
  fs.readFileSync(path.join(__dirname, 'examples.md'), 'utf8')
).children[0]
 .children
 .map(function(example, i) {
   var tokens = example.tokens.slice()
   tokens.links = {}

   var thumb = 'default.jpg'
   var $     = cheerio.load(
     marked.Parser.parse(tokens)
   )

   $('img').each(function(i, img) {
     var $img = $(img)
     thumb = $img.attr('src')
     $img.parent().remove()
   })

   var html = $.html()
   var head = cheerio.load(marked(example.text))
   var link = head('a')
   var feat = !!head('em').length
   var name = link.text()

   console.error('*', name)

   return {
       name: name
     , link: link.attr('href')
     , desc: feat && html.trim() || ''
     , thumb: thumb
     , featured: feat
     , i: i
   }
 })
 .sort(function(a, b) {
   if (a.featured) return -1
   if (b.featured) return +1
  return a.i - b.i
 })

fs.writeFileSync(__dirname + '/../build/examples.json'
  , JSON.stringify(examples, null, 2)
)

console.error()
console.error('extracting packages')

var packages = tree(
  fs.readFileSync(path.join(__dirname, 'packages.md'), 'utf8')
).children[0]
 .children
 .reduce(function(list, category) {
    category.text = unhtml(category.text)

    list[category.text] = category.children.map(function(pkg, i) {
      pkg.tokens.links = {}

      var name = unhtml(pkg.text)
      var html = marked.Parser.parse(pkg.tokens)
      var thumb = 'default.jpg'

      var $ = cheerio.load(html)

      $('img').each(function(i, img) {
        var $img = $(img)
        thumb = $img.attr('src')
        $img.parent().remove()
      })

      var desc = $.html()

      console.error('*', category.text, '/', name)

      return {
          name: name
        , desc: desc
        , link: 'http://ghub.io/' + name
        , thumb: thumb || ''
        , featured: false
        , i: i
      }
    })

   return list
 }, {})

fs.writeFileSync(__dirname + '/../build/packages.json'
  , JSON.stringify(packages, null, 2)
)
