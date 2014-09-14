var clear        = require('gl-clear')({ color: [1, 1, 1, 1] })
var triangle     = require('a-big-triangle')
var debounce     = require('frame-debounce')
var fit          = require('canvas-fit')
var createBuffer = require('gl-buffer')
var ndarray      = require('ndarray')
var Shader       = require('glslify')
var FBO          = require('gl-fbo')
var VAO          = require('gl-vao')
var SIZE  = 32
var STEPS = 2

module.exports = init

function init(canvas) {
  var gl      = require('gl-context')(canvas, render)
  var boid    = require('gl-texture2d')(gl, require('./boid'))
  var vao     = createParticleVAO(gl, SIZE)
  var shaders = {}
  var pdata   = []

  var starter = createStartPositions(SIZE)
  for (var i = 0; i < STEPS; i++) {
    pdata[i] = FBO(gl, [SIZE, SIZE], { float: true })
    pdata[i].color[0].setPixels(starter)
  }

  window.addEventListener('resize'
    , debounce(fit(canvas, window))
  )

  shaders.logic  = Shader({
      vert: './shaders/logic.vert'
    , frag: './shaders/logic.frag'
  })(gl)

  shaders.render = Shader({
      vert: './shaders/render.vert'
    , frag: './shaders/render.frag'
  })(gl)

  function render() {
    var width  = canvas.width
    var height = canvas.height

    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.CULL_FACE)
    gl.disable(gl.BLEND)
    pdata[0].bind()

    gl.viewport(0, 0, width, height)
    shaders.logic.bind()
    shaders.logic.uniforms.positions = pdata[1].color[0].bind(0)
    triangle(gl)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, width, height)
    clear(gl)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.DST_COLOR, gl.ZERO)

    shaders.render.bind()
    shaders.render.uniforms.positions = pdata[0].color[0].bind(0)
    shaders.render.uniforms.tex = boid.bind(1)
    shaders.render.uniforms.screenSize = [width, height]
    vao.bind()
    vao.draw(gl.POINTS, vao.length)

    switchFrames(pdata)
  }
}

function switchFrames(data) {
  data.push(data.shift())
  return data
}

function createParticleVAO(gl, size) {
  var data = new Float32Array(size * size)
  var n = 0
  for (var x = 0; x < size; x++)
  for (var y = 0; y < size; y++) {
    data[n++] = x / size
    data[n++] = y / size
  }

  var buffer = createBuffer(gl, data)
  var vao = VAO(gl, [{
    buffer: buffer
    , type: gl.FLOAT
    , size: 2
  }])

  vao.length = data.length / 2

  return vao
}

function createStartPositions(size) {
  var data = new Float32Array(size * size * 4)
  for (var i = 0; i < data.length;) {
    // positions
    data[i++] = Math.random() - 0.5
    data[i++] = Math.random() - 0.5
    // speeds
    data[i++] = Math.random() * 0.1 - 0.05
    data[i++] = Math.random() * 0.1 - 0.05
  }

  return ndarray(data, [size, size, 4])
}
