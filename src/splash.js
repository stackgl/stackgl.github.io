var cl = require('class-list')

try {
  require('@stackgl/splash-grid')(
    document.getElementById('grid').querySelector('canvas')
  )
} catch(e) {
  cl(document.body).add('no-webgl')
}
