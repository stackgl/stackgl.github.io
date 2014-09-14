var clear    = require('gl-clear')({ color: [1, 0, 1, 1] })
var debounce = require('frame-debounce')
var fit      = require('canvas-fit')
var Shader   = require('glslify')
var FBO      = require('gl-fbo')

module.exports = init

function init(canvas) {
  var gl = require('gl-context')(canvas, render)

  window.addEventListener('resize'
    , debounce(fit(canvas, window))
  )

  function render() {
    var width  = canvas.width
    var height = canvas.height

    gl.viewport(0, 0, width, height)
    clear(gl)
  }
}
