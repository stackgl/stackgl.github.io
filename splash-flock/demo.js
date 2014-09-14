document.body.style.margin = 0
document.body.style.padding = 0
document.body.style.overflow = 'hidden'

require('./')(document.body.appendChild(
  document.createElement('canvas')
))
