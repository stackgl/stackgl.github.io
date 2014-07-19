var debounce = require('frame-debounce')

module.exports = fill

function fill(elements) {
  refill()
  window.addEventListener('resize'
    , debounce(refill)
    , false
  )

  function refill() {
    var width = window.innerWidth + 'px'
    var height = window.innerHeight + 'px'

    for (var i = 0; i < elements.length; i++) {
      var s = elements[i].style
      s.width = width
      s.minHeight = height
    }
  }
}
