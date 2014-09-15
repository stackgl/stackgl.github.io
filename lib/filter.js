var findup    = require('findup-element')
var minstache = require('minstache')
var domify    = require('domify')
var slice     = require('sliced')
var fs        = require('fs')

var all = 'All Packages'
var template = minstache.compile(fs.readFileSync(
  __dirname + '/filter.html'
, 'utf8'))

module.exports = function(thumbs) {
  var filtered = slice(thumbs.querySelectorAll('[data-filter]'))

  var categories = filtered.reduce(function(categories, el) {
    var cat = el.getAttribute('data-filter')
    if (categories.indexOf(cat) === -1) categories.push(cat)
    return categories
  }, [])

  categories.unshift(all)
  categories = categories.map(function(name) {
    return { name: name }
  })

  var list = domify(template({ category: categories }))
  var children = slice(list.childNodes).filter(function(node) {
    return node.nodeType === Node.ELEMENT_NODE
  })

  var prev = children[0]

  children[0].setAttribute('class', 'selected')
  children.forEach(function(child) {
    var name = child.getAttribute('data-name')

    child.addEventListener('click', function(e) {
      e.preventDefault()
      e.stopPropagation()
      var target = findup(e.target, 'li')
      if (target !== child) return false

      prev.setAttribute('class', '')
      prev = target
      prev.setAttribute('class', 'selected')
      for (var i = 0; i < filtered.length; i++) {
        filtered[i].style.display = (
          name === all ||
          name === filtered[i].getAttribute('data-filter')
        ) ? 'block'
          : 'none'
      }

      return false
    }, false)
  })

  return list
}
