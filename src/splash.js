var cl = require('class-list')

try {
  require('@stackgl/splash-grid')(
    document.getElementById('grid')
  )
} catch(e) {
  cl(document.body).add('no-webgl')
}
